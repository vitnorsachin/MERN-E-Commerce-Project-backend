import express from "express";
import {
  createOrder,
  deleteOrder,
  fetchOrdersByUser,
  updateOrder,
} from "../controllers/Order.controller.js";

const router = express.Router();

router
  .get("/", fetchOrdersByUser)
  .post("/", createOrder)
  .patch("/:id", updateOrder)
  .delete("/:id", deleteOrder);

export default router;