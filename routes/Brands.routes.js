import express from "express";
const router = express.Router();
import { createBrand, fetchBrands } from "../controllers/Brand.controller.js";

router.get("/", fetchBrands).post("/", createBrand);
export default router;