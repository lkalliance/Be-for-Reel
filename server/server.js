const express = require("express");
const path = require("path");
const db = require("./config/connection");
const { ApolloServer } = require("apollo-server-express");
const { authMiddleware } = require("./utils/auth");
const { typeDefs, resolvers } = require("./schemas");

const PORT = process.env.PORT || 3001;
const app = express();
// const routes = require("./controllers/movie-search.js");
const routes = require("./controllers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
  formatError: (formattedError, error) => {
    console.log(formattedError.message);
    if (formattedError.message.startsWith("Database Error: ")) {
      return { message: "Internal server error" };
    }

    // Otherwise return the formatted error.
    return formattedError;
  },
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(routes);
app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
  await server.start();
  server.applyMiddleware({ app });

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};

// Call the async function to start the server
startApolloServer();
