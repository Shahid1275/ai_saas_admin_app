// tenantRoutes.js
import express from "express";
import {
  createTenant,
  getTenants,
  getTenantById,
} from "../controllers/tenantController.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/role.js";

const Tenantrouter = express.Router();

Tenantrouter.post("/init", createTenant); // Unprotected initial setup routes
Tenantrouter.post("/", authenticate, authorize(["SuperAdmin"]), createTenant);
Tenantrouter.get("/", authenticate, getTenants);
Tenantrouter.get("/:id", authenticate, getTenantById);

export default Tenantrouter;
