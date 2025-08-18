import Order from "../models/Order.model.js";

export const fetchOrdersByUser = async (req, res) => {
  const { id } = req.user;
  try {
    const allUserOrders = await Order.find({ user: id });
    // console.log(allUserOrders)
    res.status(200).json(allUserOrders);
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

// export const fetchAllOrders = async (req, res) => {
//   try {
//     const allOrders = await Order.find();
//     res.status(200).json(allOrders);
//   } catch (err) {
//     console.error(err);
//     res.status(400).json(err);
//   }
// };

export const fetchAllOrders = async (req, res) => {
  let query = Order.find({deleted: {$ne:true}}); // find data from database

  // TODO : How to get sort on discounted Price not on Actual Price
  if (req.query._sort && req.query._order) {
    // sort = { [_sort:"price"]: req.query._order }
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  const totalOrders = await query.clone().countDocuments();
  // console.log(totalOrders)

  if (req.query._page && req.query._limit) {
    // pagination = {_page=4&_limit=9}
    const page = req.query._page;
    const pageSize = req.query._limit;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const orders = await query.exec(); // fetch data from database
    res.set("X-Total-Count", totalOrders);
    res.status(200).json({ items: totalOrders, data: orders });
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
};