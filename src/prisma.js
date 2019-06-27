import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466' // Where the Prisma GraphQL API lives
});

// prisma.query
// prisma.mutation
// prisma.subscription
// prisma.exists

const createPostForUser = async (authorId, data) => {
  const post = await prisma.mutation.createPost(
    {
      data: {
        ...data,
        author: {
          connect: {
            id: authorId
          }
        }
      }
    },
    '{ id }'
  );

  const user = await prisma.query.user(
    {
      where: {
        id: authorId
      }
    },
    '{ id name email posts { id title published } }'
  );

  return user;
};

// createPostForUser('cjxf4ufbd00b20831c6ot1qeb', {
//   title: 'Great books to read',
//   body: 'The war of art',
//   published: true
// }).then(user => {
//   console.log(JSON.stringify(user, undefined, 2));
// });

const updatePostForUser = async (postId, data) => {
  const post = await prisma.mutation.updatePost(
    {
      where: {
        id: postId
      },
      data
    },
    '{ author { id }}'
  );

  const user = await prisma.query.user(
    {
      where: {
        id: post.author.id
      }
    },
    '{ id name email posts { id title published } }'
  );
  return user;
};

// updatePostForUser('cjxfashm400kx0831cb0jdore', { published: false }).then(
//   user => {
//     console.log(JSON.stringify(user, undefined, 2));
//   }
// );
