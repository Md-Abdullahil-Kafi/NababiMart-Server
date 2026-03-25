import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import rootRoutes from "./routes/index.js";
import connectDB from "./config/db.js";

dotenv.config();
await connectDB();
connectDB().catch((err) => {
  console.error("Initial DB connect failed:", err.message);
});

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.CLIENT_URL
    ].filter(Boolean),
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running",
  });
});

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "API route working",
  });
});

app.get("/api/debug-db", async (req, res) => {
  res.json({
    hasMongoUri: !!process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || null,
    nodeEnv: process.env.NODE_ENV || null
  });
});

app.use("/api", rootRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;