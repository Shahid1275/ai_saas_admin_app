import express from "express";
import "dotenv/config";
import cors from "cors";

import router from "./routes/authRoutes.js";
import Tenantrouter from "./routes/tenantRoutes.js";
import { connectDB } from "./config/db.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", router);
app.use("/api/tenants", Tenantrouter);

app.get("/", (req, res) => {
  res.send("Welcome to the backend");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log("✅ Database connected successfully");
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  } catch (err) {
    console.error("❌ Error connecting DB:", err.message);
  }
});
