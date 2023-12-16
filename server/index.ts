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
    members: [Member]
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