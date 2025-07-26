import express from "express";
const router = express.Router();
import { createCategory, fetchCategories } from "../controller/Category.js";

router.get("/", fetchCategories).post("/", createCategory);
export default router;