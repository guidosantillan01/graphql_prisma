const Subscription = {
  comment: {
    subscribe(parent, { postId }, { prisma }, info) {
      // We needed to change the schema.graphql file. data to node
      // type CommentSubscriptionPayload {
      //   mutation: MutationType!
      //   node: Comment
      // }

      return prisma.subscription.comment(
        {
          where: {
            node: {
              post: {
                id: postId
              }
            }
          }
        },
        info
      );
    }
  },
  post: {
    subscribe(parent, args, { prisma }, info) {
      // We needed to change the schema.graphql file. data to node
      // type PostSubscriptionPayload {
      //   mutation: MutationType!
      //   node: Post
      // }

      return prisma.subscription.post(
        {
          where: {
            node: {
              published: true
            }
          }
        },
        info
      );
    }
  }
};

export { Subscription as default };
