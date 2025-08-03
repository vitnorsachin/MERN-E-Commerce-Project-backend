import express from "express";
import {
  createOrder,
  deleteOrder,
  fetchAllOrders,
  fetchOrdersByUser,
  updateOrder,
} from "../controllers/Order.controller.js";

const router = express.Router();

router
  .get("/", fetchAllOrders)
  .get("/user/:userId", fetchOrdersByUser)
  .post("/", createOrder)
  .patch("/:id", updateOrder)
  .delete("/:id", deleteOrder);

export default router;