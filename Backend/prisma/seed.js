const { PrismaClient } = require("@prisma/client");
const { hashPassword } = require("../utils/hash");
const prisma = new PrismaClient();

async function main() {
  // 1. Create initial tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: "Default Tenant",
    },
  });

  // 2. Create default roles
  const roles = await Promise.all([
    prisma.role.create({ data: { name: "SuperAdmin" } }),
    prisma.role.create({ data: { name: "Admin" } }),
    prisma.role.create({ data: { name: "Manager" } }),
    prisma.role.create({ data: { name: "User" } }),
  ]);

  // 3. Create initial admin user
  const hashedPassword = await hashPassword("Admin@1234");
  const admin = await prisma.user.create({
    data: {
      name: "System Admin",
      email: "admin@example.com",
      password: hashedPassword,
      role_id: roles.find((r) => r.name === "SuperAdmin").id,
      tenant_id: tenant.id,
    },
  });

  console.log("🎉 Seed data created:");
  console.log({ tenant, roles, admin });
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
