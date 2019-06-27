import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466' // Where the Prisma GraphQL API lives
});

// prisma.query
// prisma.mutation
// prisma.subscription
// prisma.exists

// prisma.query.users(null, '{ id name posts { id title } }').then(data => {
//   console.log(JSON.stringify(data, undefined, 2));
// });

// prisma.query.comments(null, '{ id text author { id name }}').then(data => {
//   console.log(JSON.stringify(data, undefined, 2));
// });

// prisma.mutation
//   .createPost(
//     {
//       data: {
//         title: 'GraphQL 101',
//         body: '',
//         published: false,
//         author: {
//           connect: {
//             id: 'cjxf3udhf00c00831woz0a57y'
//           }
//         }
//       }
//     },
//     '{ id title body published }'
//   )
//   .then(data => {
//     console.log(data);
//     return prisma.query.users(null, '{ id name posts { id title } }');
//   })
//   .then(data => {
//     console.log(JSON.stringify(data, undefined, 2));
//   });

prisma.mutation
  .updatePost(
    {
      where: {
        id: 'cjxf9riqa00cs0831wa8ytb8p'
      },
      data: {
        body: 'This is an updated post',
        published: true
      }
    },
    '{ id }'
  )
  .then(data => {
    return prisma.query.posts(null, '{ id title body published }');
  })
  .then(data => {
    console.log(JSON.stringify(data, undefined, 2));
  });
