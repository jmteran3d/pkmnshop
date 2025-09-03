import bcrypt from 'bcrypt';
import crypto from "crypto";

const SALT_ROUNDS = 10;

export const hashPassword = (plain) => bcrypt.hashSync(plain, SALT_ROUNDS);
export const comparePassword = (plain, hash) => bcrypt.compareSync(plain, hash);
export const randomToken = (len = 48) => crypto.randomBytes(len).toString("hex");