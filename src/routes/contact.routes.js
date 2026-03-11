import express from "express";

import { protectRoute } from "../middleware/auth.middleware.js";

import {
  createContact,
  getContact,
  changeStatus,
} from "../controllers/contact.controller.js";
import { queryProtection } from "../lib/security.js";

const contactRoutes = express.Router();

contactRoutes.post("/create", ...queryProtection, createContact);

contactRoutes.get("/get", protectRoute, getContact);

contactRoutes.put("/update", protectRoute, changeStatus);

export default contactRoutes;
