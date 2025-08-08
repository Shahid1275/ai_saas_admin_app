// config/constants.js
export const SALT_ROUNDS = 10;
export const JWT_SECRET = process.env.JWT_SECRET || "myjwtsecret";
export const JWT_EXPIRES_IN = "1h";
export const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "myjwtrefreshsecret";
export const REFRESH_TOKEN_EXPIRES_IN = "7d";
