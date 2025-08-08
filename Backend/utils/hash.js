// hash.js
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../config/constants.js";

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
