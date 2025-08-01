import express from "express";
import { fetchUserById, updateUser } from "../controllers/User.controller.js";

const router = express.Router();
// user is already added in base path
router.route("/:id").get(fetchUserById).patch(updateUser);

export default router;