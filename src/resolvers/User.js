import getUserId from '../utils/getUserId.js';

const User = {
  // parent fields might not be available. E.g. if we do not call the id in the query, the condition
  // below is false. We will solve this with Fragments.
  email: {
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, { request }, info) {
      const userId = getUserId(request, false);

      if (userId && userId === parent.id) {
        return parent.email;
      } else {
        return null;
      }
    }
  },
  password(parent, args, ctx, info) {
    // Security flaw, where the password returns when asked. It should not do that.
    return null;
  },
  posts: {
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, { prisma }, info) {
      return prisma.query.posts({
        where: {
          published: true,
          author: {
            id: parent.id
          }
        }
      });
    }
  }
};

export { User as default };
