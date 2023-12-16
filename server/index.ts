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
    job_start_year: String
    joined_year: String
    role: Role
    jobTitle: JobTitle
  }
  type Role {
    name: String
  }
  type JobTitle {
    name: String
  }
  type Query {
    members: [Member]
  }
  type MutationResultType {
    isSuccess: Boolean
  }
  type Mutation {
    createMember(role_id: Int!, job_title_id: Int!, no: String, name: String, profile_img: String, gender: String, birthday: String, job_start_year: String, joined_year: String): Member
    updateMember(id: Int!, role_id: Int, job_title_id: Int, no: String, name: String, profile_img: String, gender: String, birthday: String, job_start_year: String, joined_year: String): Member
    deleteMember(id: Int!): MutationResultType
  }
`;

const resolvers = {
  Query: {
    members: async () => {
      const { data: members, error } = await supabase.from("Member").select("*");

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
  Mutation: {
    createMember: async (_, { role_id, job_title_id, no, name, profile_img, gender, birthday, job_start_year, joined_year }) => {
      // 1. 사용자가 입력한 role_id 값이 Role 테이블 내 존재하는지 확인합니다.
      const { data: roles, error: rolesError } = await supabase
        .from("Role")
        .select("*")
        .eq("id", role_id);
      if (rolesError) {
        handleError(rolesError.message);
      }
      if (!roles.length) {
        handleError('invalid role_id');
      }

      // 2. 사용자가 입력한 job_title_id 값이 JobTitle 테이블 내 존재하는지 확인합니다.
      const { data: jobTitles, error: jobTitlesError } = await supabase
        .from("JobTitle")
        .select("*")
        .eq("id", job_title_id);
      if (jobTitlesError) {
        handleError(jobTitlesError.message);
      }
      if (!jobTitles.length) {
        handleError('invalid jobTitles');
      }

      // TODO: 3. 사용자가 입력한 값이 테이블 내 중복되지 않는지 확인합니다.


      // 4. 입력받은 데이터를 Member 테이블에 등록합니다.
      const { data: members, error: membersError } = await supabase
        .from('Member')
        .insert({
          no,
          name,
          role_id,
          profile_img,
          gender,
          birthday,
          job_start_year,
          joined_year,
          job_title_id
        })
        .select();

      if (membersError) {
        handleError(membersError.message);
      }
      return members[0];
    },
    updateMember: async (_, { id, role_id, job_title_id, no, name, profile_img, gender, birthday, job_start_year, joined_year }) => {
      const { data: members, error: updateError } = await supabase
        .from('Member')
        .update({
          role_id,
          job_title_id,
          no,
          name,
          profile_img,
          gender,
          birthday,
          job_start_year,
          joined_year
        })
        .eq('id', id)
        .select();

      if (updateError) {
        handleError(updateError.message);
      }
      // QUESTION: 에러가 아닌데 서버쪽에서 에러문구를 나타내는게 맞나. 혹은 프론트에서 처리해야하는것인가?
      if (!members[0]) {
        handleError('업데이트된 정보가 없습니다.');
      }

      return members[0];
    },
    deleteMember: async (_, { id }) => {
      const { error: deleteError } = await supabase
        .from('Member')
        .delete()
        .eq('id', id);

      if (deleteError) {
        handleError(deleteError.message);
      }
      return { isSuccess: true };
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

const handleError = (message) => {
  throw Error(message);
};