const Query = {
  users(parent, args, { prisma }, info) {
    const opArgs = {}; // operationArgs

    if (args.query) {
      opArgs.where = {
        OR: [
          {
            name_contains: args.query
          },
          {
            email_contains: args.query
          }
        ]
      };
    }

    // prisma.query.users(can return null, String, object)
    return prisma.query.users(opArgs, info); // It waits the promise
  },
  posts(parent, args, { prisma }, info) {
    const opArgs = {};

    if (args.query) {
      opArgs.where = {
        OR: [
          {
            title_contains: args.query
          },
          {
            body_contains: args.query
          }
        ]
      };
    }

    return prisma.query.posts(opArgs, info);
  },
  comments(parent, args, { db }, info) {
    return db.comments;
  },
  me() {
    return {
      // We call the database here
      id: '123aaa',
      name: 'Mike',
      email: 'mike@example.com',
      age: 21
    };
  },
  post() {
    return {
      id: 'qq223e',
      title: 'This is a post title',
      body: 'This is the body of the post',
      published: true
    };
  }
};

export { Query as default };
