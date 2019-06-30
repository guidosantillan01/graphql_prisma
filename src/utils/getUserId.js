import jwt from 'jsonwebtoken';

const secret = 'secretsecret';

const getUserId = (request, requireAuth = true) => {
  // request.request.headers.authorization for HTTP
  // request.connection.context.Authorization for Web Sockers (subscriptions)
  const header = request.request
    ? request.request.headers.authorization
    : request.connection.context.Authorization;

  if (header) {
    const token = header.replace('Bearer ', '');
    const decoded = jwt.verify(token, secret);
    return decoded.userId;
  }

  if (requireAuth) {
    throw new Error('Authentication required');
  }

  return null;
};

export { getUserId as default };
