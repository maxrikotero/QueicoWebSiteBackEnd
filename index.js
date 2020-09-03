const { ApolloServer, gql } = require("apollo-server");
const { MongoClient } = require("mongodb");

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
  }

  type Query {
    users: [User]!
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    users: (_parent, _args, _context, _info) => {
      console.log("resolvers");
      return _context.db
        .collection("users")
        .find()
        .then((data) => {
          console.log("base ", data);
          return [];
        })
        .catch((error) => console.log("error"));
    }
  }
};

let db;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async () => {
    if (!db) {
      try {
        const dbClient = new MongoClient(
          "mongodb+srv://maxi:YObongo1@cluster0.sazsd.mongodb.net/MiAdmin?retryWrites=true&w=majority",
          {
            useNewUrlParser: true,
            useUnifiedTopology: true
          }
        );

        if (!dbClient.isConnected()) await dbClient.connect();
        db = dbClient.db("MiAdmin"); // database name
        console.log("Data Base Connected");
      } catch (e) {
        console.log("--->error while connecting with graphql context (db)", e);
      }
    }

    return { db };
  }
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
