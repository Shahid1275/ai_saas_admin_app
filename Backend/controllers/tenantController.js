// tenantController.js
import prisma from "../config/db.js"; // Use default import

export const createTenant = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    // Check if tenant exists using correct Prisma method
    const existingTenant = await prisma.tenant.findFirst({
      where: { name },
    });

    if (existingTenant) {
      return res.status(409).json({ error: "Tenant already exists" });
    }

    const tenant = await prisma.tenant.create({
      data: { name },
    });

    res.status(201).json(tenant);
  } catch (error) {
    console.error("Tenant creation error:", error);
    res.status(500).json({
      error: "Failed to create tenant",
      details: error.message,
    });
  }
};

// Add these if not existing
export const getTenants = async (req, res) => {
  try {
    const tenants = await prisma.tenant.findMany();
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tenants" });
  }
};

export const getTenantById = async (req, res) => {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id: req.params.id },
    });
    res.json(tenant);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tenant" });
  }
};
