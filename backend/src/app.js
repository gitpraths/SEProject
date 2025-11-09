// Load environment variables FIRST
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import { connectPostgres, sequelize } from "./config/postgres.js";
import { connectMongo } from "./config/mongo.js";

// Load PostgreSQL models
import "./pg_models/index.js"; 

// ✅ Import ALL routes at the top
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

// Debug log (optional)
console.log("Sequelize models loaded:", Object.keys(sequelize.models));

// ✅ Create app
const app = express();

// ✅ Core middleware (BEFORE routes)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Add this too for form data

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log("Content-Type:", req.headers["content-type"]);
  console.log("Body:", req.body);
  next();
});
// ✅ Mount ALL routes (AFTER middleware)
app.use("/auth", authRoutes);
app.use("/profiles", profileRoutes);

console.log("✅ All routes initialized");

// Health-check route
app.get("/", (req, res) => res.send("Backend running ✅"));

// Centralized startup
async function startServer() {
  try {
    console.log("🔹 Connecting to PostgreSQL...");
    await connectPostgres();

    console.log("🔹 Connecting to MongoDB...");
    await connectMongo();

    console.log("🔹 Syncing Sequelize models...");
    await sequelize.sync({ alter: true });
    console.log("✅ Tables synced with PostgreSQL");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
  } catch (err) {
    console.error("❌ Error during startup:", err.message);
    process.exit(1);
  }
}

startServer();