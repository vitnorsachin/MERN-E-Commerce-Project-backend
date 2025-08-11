import express from "express";
import { fetchUserById, updateUser } from "../controllers/User.controller.js";

const router = express.Router();
// user is already added in base path
router.get("/own", fetchUserById);
router.patch("/:id", updateUser);

export default router;