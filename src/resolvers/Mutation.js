import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Section #70
// const isMatch = await bcrypt.compare(password, hashedPassword)
// console.log(isMatch) -> true

const secret = 'secretsecret';

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

    const token = jwt.sign({ userId: user.id }, secret);

    return {
      user,
      token
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
      // We delete the info parameter, it will return ALL scalar fields
    );

    return {
      user,
      token: jwt.sign({ userId: user.id }, secret)
    };
  },
  async deleteUser(parent, args, { prisma }, info) {
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
  async createComment(parent, args, { prisma }, info) {
    return prisma.mutation.createComment(
      {
        data: {
          text: args.data.text,
          author: {
            connect: {
              id: args.data.author
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
  async deleteComment(parent, args, { prisma }, info) {
    return prisma.mutation.deleteComment(
      {
        where: {
          id: args.id
        }
      },
      info
    );
  },
  async updateComment(parent, args, { prisma }, info) {
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
