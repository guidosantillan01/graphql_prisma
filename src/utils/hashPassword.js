import bcrypt from 'bcryptjs';

const hashPassword = inputPassword => {
  if (inputPassword.length < 8) {
    throw new Error('Password must be 8 characters or longer');
  }

  return bcrypt.hash(inputPassword, 10); // (password, number of salt rounds)
};

export { hashPassword as default };
