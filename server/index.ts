const { createClient } = require("@supabase/supabase-js");
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const typeDefs = `#graphql
  type Member {
    id: Int
    no: String
    name: String
    profile_img: String
    gender: String
    birthday: String
    job_start_year: Int
    joined_year: Int
    role: Role
    jobTitle: JobTitle
  }
  type Role {
    id: Int
    name: String
  }
  type JobTitle {
    id: Int 
    name: String
  }
  type Query {
    members(no: String, role_id: Int, job_title_id: Int, gender: String, job_start_year: Int, job_start_year_less: Boolean, job_start_year_greater: Boolean, joined_year: Int, joined_year_less: Boolean, joined_year_greater: Boolean): [Member]
  }
`;

const resolvers = {
  Query: {
    members: async (_, { no, role_id, job_title_id, gender, job_start_year, job_start_year_less = false, job_start_year_greater = false, joined_year, joined_year_less = false, joined_year_greater = false }) => {
      let query = supabase.from("Member").select("*");

      // 1. 필터링 조건을 where절에 추가합니다
      if (no) {
        query = query.eq('no', no);
      }
      if (role_id) {
        query = query.eq('role_id', role_id);
      }
      if (job_title_id) {
        query = query.eq('job_title_id', job_title_id);
      }
      if (gender) {
        query = query.eq('gender', gender);
      }
      if (job_start_year) {
        const filterLessThan = job_start_year_less; // 경력이 더 긴 사람
        const filterGreaterThan = job_start_year_greater; // 경력이 더 짧은 사람
        const filterEqual = !filterLessThan && !filterGreaterThan; // 동일 연도에 입사한 사람
    
        if (filterLessThan) {
          query = query.lt('job_start_year', job_start_year);
        }
        if (filterEqual) {
          query = query.eq('job_start_year', job_start_year);
        }
        if (filterGreaterThan) {
          query = query.gt('job_start_year', job_start_year);
        }
      }
      if (joined_year) {
        const filterLessThan = joined_year_less; // 우리회사 근무기간이 더 긴 사람
        const filterGreaterThan = joined_year_greater; // 우리회사 근무기간이 더 짧은 사람
        const filterEqual = !filterLessThan && !filterGreaterThan; // 동일 연도에 우리회사에 입사한 사람
    
        if (filterLessThan) {
          query = query.lt('joined_year', joined_year);
        }
        if (filterEqual) {
          query = query.eq('joined_year', joined_year);
        }
        if (filterGreaterThan) {
          query = query.gt('joined_year', joined_year);
        }
      }

      const { data: members, error: membersError } = await query;

      if (membersError) {
        throw Error(membersError.message);
      };
      return members;
    },
  },
  Member: {
    role: async ({ role_id }) => {
      const { data: roles, error } = await supabase
        .from("Role")
        .select("*")
        .eq("id", role_id);

      return roles[0];
    },
    jobTitle: async ({ job_title_id }) => {
      const { data: jobTitles, error } = await supabase
        .from("JobTitle")
        .select("*")
        .eq("id", job_title_id);

      return jobTitles[0];
    }
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

(async () => {
  try {
    const { url } = await startStandaloneServer(server, {
      listen: { port: 4000 },
    });
    console.log(`🚀  Server ready at: ${url}`);
  } catch (e) {
    console.log(e);
  }
})();