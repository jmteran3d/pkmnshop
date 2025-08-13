import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const hashPassword = (plain) => bcrypt.hashSync(plain, SALT_ROUNDS);
export const comparePassword = (plain, hash) => bcrypt.compareSync(plain, hash);