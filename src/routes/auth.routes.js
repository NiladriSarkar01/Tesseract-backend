import express from "express";

import { protectRoute } from "../middleware/auth.middleware.js";
import { checkAuth, login, logout } from "../controllers/auth.controller.js";

const authRoutes = express.Router();

authRoutes.post("/login", login);

authRoutes.post("/logout", logout);

authRoutes.get("/check", protectRoute, checkAuth);

export default authRoutes;
