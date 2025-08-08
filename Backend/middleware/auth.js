import { verifyToken } from "../utils/jwt.js";

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    res.status(403).json({ error: "Invalid token" });
  }
};
