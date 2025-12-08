import express from "express";

import { protectRoute } from "../middleware/auth.middleware.js";

import {
  createContact,
  getContact,
  changeStatus,
} from "../controllers/contact.controller.js";

const contactRoutes = express.Router();

contactRoutes.post("/create", createContact);

contactRoutes.get("/get", protectRoute, getContact);

contactRoutes.put("/update", protectRoute, changeStatus);

export default contactRoutes;
