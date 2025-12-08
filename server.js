import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./src/routes/auth.routes.js";

import connectDB from "./src/lib/db.js";
import applicationRoutes from "./src/routes/application.routes.js";
import contactRoutes from "./src/routes/contact.routes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: "https://tesseract-two.vercel.app",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/application", applicationRoutes);
app.use("/api/contact", contactRoutes);

async function startServer() {
  try {
    await connectDB(); // Ensure DB is connected BEFORE starting the server
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
