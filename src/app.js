import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import rootRoutes from "./routes/index.js";

dotenv.config();

const app = express();

// middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

// routes
app.use("/api", rootRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running"
  });
});


// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;