import express from "express";

import { protectRoute } from "../middleware/auth.middleware.js";

import {
  changeStatus,
  createApplication,
  getApplications,
} from "../controllers/application.controller.js";

const applicationRoutes = express.Router();

applicationRoutes.post("/create", createApplication);

applicationRoutes.get("/get", protectRoute, getApplications);

applicationRoutes.put("/update", protectRoute, changeStatus);

export default applicationRoutes;
