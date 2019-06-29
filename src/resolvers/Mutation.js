import uuidv4 from 'uuid';

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    // Prisma handles these type of errors, so we can delete this code.
    // const emailTaken = await prisma.exists.User({ email: args.data.email });

    // if (emailTaken) {
    //   throw new Error('Email taken');
    // }

    // You could also have done:
    // const user = await prisma.mutation.createUser({ data: args.data }, info);
    // return user;

    return prisma.mutation.createUser(
      {
        data: args.data
      },
      info
    );
  },
  async deleteUser(parent, args, { prisma }, info) {
    // Prisma handles these type of errors, so we can delete this code.
    // const userExists = await prisma.exists.User({ id: args.id });

    // if (!userExists) {
    //   throw new Error('User not found');
    // }

    // Comments and Posts are also deleted because of the relationship. (@relation)

    return prisma.mutation.deleteUser(
      {
        where: { id: args.id }
      },
      info
    );
  },
  async updateUser(parent, args, { prisma }, info) {
    return prisma.mutation.updateUser(
      {
        where: { id: args.id },
        data: args.data
      },
      info
    );
  },
  async createPost(parent, args, { prisma }, info) {
    return prisma.mutation.createPost(
      {
        data: {
          title: args.data.title,
          body: args.data.body,
          published: args.data.published,
          author: {
            connect: {
              id: args.data.author
            }
          }
        }
      },
      info
    );
  },
  async deletePost(parent, args, { prisma }, info) {
    return prisma.mutation.deletePost(
      {
        where: {
          id: args.id
        }
      },
      info
    );
  },
  async updatePost(parent, args, { prisma }, info) {
    return prisma.mutation.updatePost(
      {
        where: {
          id: args.id
        },
        data: args.data
      },
      info
    );
  },
  createComment(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some(user => user.id === args.data.author);
    const postExists = db.posts.some(
      post => post.id === args.data.post && post.published
    );

    if (!userExists || !postExists) {
      throw new Error('Unable to find user and post');
    }

    const comment = {
      id: uuidv4(),
      ...args.data
    };

    db.comments.push(comment);

    // 2. Update publish call in createComment to send back CREATED with the data
    // channel name
    pubsub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: 'CREATED',
        data: comment
      }
    });

    return comment;
  },
  deleteComment(parent, args, { db, pubsub }, info) {
    const commentIndex = db.comments.findIndex(
      comment => comment.id === args.id
    );

    if (commentIndex === -1) {
      throw new Error('Comment not found');
    }

    const [deletedComment] = db.comments.splice(commentIndex, 1);

    // 3. Add publish call in deleteComment using DELETED event
    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: {
        mutation: 'DELETED',
        data: deletedComment
      }
    });

    return deletedComment;
  },
  updateComment(parent, args, { db, pubsub }, info) {
    const { id, data } = args;

    const comment = db.comments.find(comment => comment.id === id);

    if (!comment) {
      throw new Error('Comment not found');
    }

    if (typeof data.text === 'string') {
      comment.text = data.text;
    }

    // 4. Add publish call in updateComment using UPDATED event
    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'UPDATED',
        data: comment
      }
    });

    return comment;
  }
};

export { Mutation as default };
