import Cart from "../models/Cart.model.js";


export const fetchCartByUser = async (req, res) => {
  const { id } = req.user;
  try {
    // const cartItems = await Cart.find({ user: user }).populate("user").populate("product");
    const cartItems = await Cart.find({ user: id }).populate("product"); // 🟢 changes base on video
    res.status(200).json(cartItems);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
};


export const addToCart = async (req, res) => {
  const {id} = req.user;
  const cart = new Cart({ ...req.body, user:id });
  try {
    const newCartItem = await cart.save()
    const result = await newCartItem.populate("product");
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
};


export const deleteFromCart = async (req, res) => {
  const { id } = req.params;
  try {
    await Cart.findByIdAndDelete(id);
    res.status(200).json({ message: "item deleted from cart" });
  } catch (err) {
    res.status(400).json(err);
  }
};


export const updateCart = async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await Cart.findByIdAndUpdate(id, req.body, { new: true,}).populate("product");
    res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
};