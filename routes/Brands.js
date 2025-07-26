import express from "express";
const router = express.Router();
import { createBrand, fetchBrands } from "../controller/Brand.js";

router.get("/", fetchBrands).post("/", createBrand);
export default router;