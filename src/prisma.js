import { Prisma } from 'prisma-binding';
import { fragmentReplacements } from './resolvers/index';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466', // Where the Prisma GraphQL API lives
  secret: 'thisisasecrettext', // Now I am able to communicate with Prisma with Node.js.
  fragmentReplacements
});

export { prisma as default };

// These methods return a Promise. E.g prisma.query.createPost() -> Promise
// prisma.query
// prisma.mutation
// prisma.subscription
// prisma.exists
