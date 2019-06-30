import bcrypt from 'bcryptjs';

import generateToken from '../utils/generateToken';
import getUserId from '../utils/getUserId';

const Mutation = {
  async login(parent, args, { prisma }, info) {
    const inputEmail = args.data.email;
    const inputPassword = args.data.password;

    const user = await prisma.query.user({
      where: {
        email: inputEmail
      }
    });
    if (!user) {
      throw new Error('Unable to login');
    }

    const storedPassword = user.password;
    const isMatch = await bcrypt.compare(inputPassword, storedPassword);
    if (!isMatch) {
      throw new Error('Unable to login');
    }

    return {
      user,
      token: generateToken(user.id)
    };
  },
  async createUser(parent, args, { prisma }, info) {
    const inputPassword = args.data.password;
    if (inputPassword.length < 8) {
      throw new Error('Password must be 8 characters or longer');
    }

    const hashedPassword = await bcrypt.hash(inputPassword, 10); // (password, number of salt rounds)
    const user = await prisma.mutation.createUser(
      {
        data: {
          ...args.data,
          password: hashedPassword
        }
      }
      // We delete the `info` parameter, it will return ALL scalar fields
    );

    return {
      user,
      token: generateToken(user.id)
    };
  },
  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.deleteUser(
      {
        where: {
          id: userId
        }
      },
      info
    );
  },
  async updateUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.updateUser(
      {
        where: {
          id: userId
        },
        data: args.data
      },
      info
    );
  },
  createPost(parent, args, { prisma, request }, info) {
    // Only an authenticated user can create a post
    // Use HTTP Header with a valid token:
    // {
    //   "Authorization": "Bearer eyJhb...."
    // }
    // This header can be found at context() {...}
    const userId = getUserId(request);

    return prisma.mutation.createPost(
      {
        data: {
          title: args.data.title,
          body: args.data.body,
          published: args.data.published,
          author: {
            connect: {
              id: userId
            }
          }
        }
      },
      info
    );
  },
  async deletePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const postExists = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId
      }
    });

    if (!postExists) {
      throw new Error('Unable to delete post');
    }

    return prisma.mutation.deletePost(
      {
        where: {
          id: args.id
        }
      },
      info
    );
  },
  async updatePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const postExists = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId
      }
    });

    if (!postExists) {
      throw new Error('Unable to update post');
    }

    const isPostPublished = await prisma.exists.Post({
      id: args.id,
      published: true
    });

    if (isPostPublished && !args.data.published) {
      return prisma.mutation.deleteManyComments({
        where: {
          post: {
            id: args.id
          }
        }
      });
    }

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
  async createComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const postExists = await prisma.exists.Post({
      id: args.data.post,
      published: true
    });

    if (!postExists) {
      throw new Error('Unable to find post');
    }

    return prisma.mutation.createComment(
      {
        data: {
          text: args.data.text,
          author: {
            connect: {
              id: userId
            }
          },
          post: {
            connect: {
              id: args.data.post
            }
          }
        }
      },
      info
    );
  },
  async deleteComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId
      }
    });

    if (!commentExists) {
      throw new Error('Unable to delete comment');
    }

    return prisma.mutation.deleteComment(
      {
        where: {
          id: args.id
        }
      },
      info
    );
  },
  async updateComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId
      }
    });

    if (!commentExists) {
      throw new Error('Unable to update comment');
    }

    return prisma.mutation.updateComment(
      {
        where: {
          id: args.id
        },
        data: args.data
      },
      info
    );
  }
};

export { Mutation as default };
