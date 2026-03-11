import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { PORT } from "./src/config/env.js";

import authRoutes from "./src/routes/auth.routes.js";

import connectDB from "./src/lib/db.js";
import applicationRoutes from "./src/routes/application.routes.js";
import contactRoutes from "./src/routes/contact.routes.js";
import { startKeepAlive } from "./keepAlive.js";
import { globalLimiter } from "./src/lib/security.js";

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "https://www.tesseract-gnit.online",
      "http://localhost:5173",
      "https://tesseract-two.vercel.app",
    ],
    // origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(globalLimiter);

app.get("/health", (req, res) => {
  return res.status(200).json({ success: true, message: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/application", applicationRoutes);
app.use("/api/contact", contactRoutes);

async function startServer() {
  try {
    await connectDB(); // Ensure DB is connected BEFORE starting the server
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);

      startKeepAlive();
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
