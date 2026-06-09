import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import rootRoutes from "./routes/index.js";
import connectDB from "./config/db.js";

dotenv.config();

await connectDB();

const app = express();

const getAllowedOrigins = () => {
  const envOrigins = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    process.env.CLIENT_URL,
    ...envOrigins,
  ].filter(Boolean);
};

const allowedOrigins = getAllowedOrigins();

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (postman/server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      try {
        if (/\.vercel\.app$/i.test(new URL(origin).hostname)) {
          return callback(null, true);
        }
      } catch (error) {
        return callback(new Error("CORS: Invalid origin"));
      }

      return callback(new Error("CORS: Origin not allowed"));
    },
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
