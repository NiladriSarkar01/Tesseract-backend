import express from "express";

import { protectRoute } from "../middleware/auth.middleware.js";
import { checkAuth, login, logout } from "../controllers/auth.controller.js";
import { loginProtection } from "../lib/security.js";

const authRoutes = express.Router();

authRoutes.post("/login", ...loginProtection, login);

authRoutes.post("/logout", protectRoute, logout);

authRoutes.get("/check", protectRoute, checkAuth);

export default authRoutes;
