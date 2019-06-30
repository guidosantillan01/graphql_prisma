import { GraphQLServer, PubSub } from 'graphql-yoga';

import db from './db';
import { resolvers, fragmentReplacements } from './resolvers/index';
import prisma from './prisma';

const pubsub = new PubSub(); // To implement subscriptions

// Startup the server
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql', // Path relative to our route folder
  resolvers, // Resolvers (Functions that run when operations are performed)
  context(request) {
    // Change context from an object to a function that returns an object
    return {
      db,
      pubsub,
      prisma,
      request
    };
  },
  fragmentReplacements
});

server.start({ port: 4001 }, () => {
  console.log('The server is up!'); // Default port: 4000
});
