import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import rootRoutes from "./routes/index.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
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

app.use("/api", rootRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;