import express from "express";
const router = express.Router();
import { createCategory, fetchCategories } from "../controllers/Category.controller.js";

router.get("/", fetchCategories).post("/", createCategory);
export default router;