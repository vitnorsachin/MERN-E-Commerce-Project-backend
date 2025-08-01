import Order from "../models/Order.model.js";

export const fetchOrdersByUser = async (req, res) => {
  const { user } = req.query;
  try {
    const allOrders = await Order.find({ user: user });
    res.status(200).json(allOrders);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
};


export const createOrder = async (req, res) => {
  const order = new Order(req.body);
  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
};


export const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndDelete(id);
    res.status(200).json({ order: order, message: "order deleted" });
  } catch (err) {
    res.status(400).json(err);
  }
};


export const updateOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const updateOrder = await Order.findByIdAndUpdate(id, req.body, { new: true,});
    res.status(200).json(updateOrder);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
};