import { prisma } from "../config/db.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken, generateRefreshToken } from "../utils/jwt.js";

export const register = async (req, res) => {
  const { name, email, password, tenantId, roleId } = req.body;

  // Validate input
  if (!name || !email || !password || !roleId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  // Validate role exists (1=SuperAdmin, 2=Admin, 3=Manager, 4=User)
  if (![1, 2, 3, 4].includes(Number(roleId))) {
    return res.status(400).json({ error: "Invalid roleId" });
  }

  // Validate tenantId is UUID if provided
  if (tenantId) {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(tenantId)) {
      return res.status(400).json({ error: "Invalid tenantId format" });
    }
  }

  try {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "Email already in use" });
    }

    // Check if tenant exists if provided
    if (tenantId) {
      const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
      });
      if (!tenant) {
        return res.status(404).json({ error: "Tenant not found" });
      }
    }

    const hash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hash,
        tenant_id: tenantId || null,
        role_id: Number(roleId),
      },
    });

    // Omit password from response
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      error: "Registration failed",
      details: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Omit password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed", details: error.message });
  }
};
