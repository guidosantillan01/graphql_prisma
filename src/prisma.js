import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466' // Where the Prisma GraphQL API lives
});

// These methods return a Promise. E.g prisma.query.createPost() -> Promise
// prisma.query
// prisma.mutation
// prisma.subscription
// prisma.exists

// prisma.exists
//   .Comment({
//     id: 'cjxf4mcxi006x0831q5o00nq5',
//     author: {
//       id: 'cjxf3udhf00c00831woz0a57y'
//     }
//   })
//   .then(exists => {
//     console.log(exists);
//   });

const createPostForUser = async (authorId, data) => {
  const userExists = await prisma.exists.User({ id: authorId });

  if (!userExists) {
    throw new Error('User not found');
  }

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
    '{ author { id name email posts { id title published }} }'
  );

  return post.author;
};

// createPostForUser('cjxf4ufbd00b20831c6ot1qeb', {
//   title: 'Great books to read VV',
//   body: 'The war of art VV',
//   published: true
// })
//   .then(user => {
//     console.log(JSON.stringify(user, undefined, 2));
//   })
//   .catch(error => {
//     console.log(error.message);
//   });

const updatePostForUser = async (postId, data) => {
  const postExists = await prisma.exists.Post({ id: postId });

  if (!postExists) {
    throw new Error('Post not found');
  }

  const post = await prisma.mutation.updatePost(
    {
      where: {
        id: postId
      },
      data
    },
    '{ author { id name email posts { id title published } }}'
  );

  return post.author;
};

// updatePostForUser('cjxfbk5ag00n508310oocyurf', {
//   title: 'Updated title from async await function',
//   published: false
// })
//   .then(user => {
//     console.log(JSON.stringify(user, undefined, 2));
//   })
//   .catch(error => {
//     console.log(error.message);
//   });
