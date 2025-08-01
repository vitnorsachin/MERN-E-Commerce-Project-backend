import User from "../models/User.model.js";


export const fetchUserById = async (req, res) => {
  const {id} = req.params;
  try {
    const user = await User.findById(id, `id name email role addresses`);
    if (!user) {
      res.status(404).json({message:"User Not found"})
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
};


export const updateUser = async (req, res) => {
  const {id} = req.params;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, {new: true})
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err)
  }
}