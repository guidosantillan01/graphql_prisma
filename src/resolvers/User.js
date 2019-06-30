import getUserId from '../utils/getUserId.js';

const User = {
  email(parent, args, { request }, info) {
    const userId = getUserId(request, false);

    // parent fields might not be available. E.g. if we do not call the id in the query, the condition
    // below is false.
    if (userId && userId === parent.id) {
      return parent.email;
    } else {
      return null;
    }
  },
  password(parent, args, ctx, info) {
    // Security flaw, where the password returns when asked. It should not do that.
    return null;
  }
};

export { User as default };
