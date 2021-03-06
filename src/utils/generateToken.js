import jwt from 'jsonwebtoken';

const secret = 'secretsecret';

const generateToken = userId => {
  return jwt.sign({ userId }, secret, { expiresIn: '7 days' });
};

export { generateToken as default };
