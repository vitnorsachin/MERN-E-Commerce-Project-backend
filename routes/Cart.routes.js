import express from "express";
const router = express.Router();
import {
  addToCart,
  deleteFromCart,
  fetchCartByUser,
  updateCart,
} from "../controllers/Cart.controller.js";

router
  .route("/")
  .get(fetchCartByUser)
  .post(addToCart);

router
  .route("/:id")
  .delete(deleteFromCart)
  .patch(updateCart);

export default router;