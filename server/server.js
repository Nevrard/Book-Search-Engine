// Dependencies
// Express Server
const express = require('express');
// Node path
const path = require('path');
// Import the Apollo Server
const { ApolloServer } = require('apollo-server-express');
// Import the typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');
// Database connection
const db = require('./config/connection');

// Set up the Express server
const app = express();
const PORT = process.env.PORT || 3001;

// Set up the Apollo Server and pass in the schema
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

// integrate the Apollo server with the Express application as middleware
server.applyMiddleware({ app });

// Express middleware for parsing
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// GraphQL and Express Server start
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});