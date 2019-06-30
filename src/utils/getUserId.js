import jwt from 'jsonwebtoken';

const secret = 'secretsecret';

const getAuthenticatedUserId = request => {
  const header = request.request.headers.authorization;

  if (!header) {
    throw new Error('Authentication required');
  }

  const token = header.replace('Bearer ', '');
  const decoded = jwt.verify(token, secret);

  return decoded.userId;
};

export { getAuthenticatedUserId as default };
