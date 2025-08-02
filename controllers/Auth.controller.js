import User from "../models/User.model.js"

export const createUser = async (req, res) => {
  const user = new User(req.body);
  try {
    const doc = await user.save(); // save() method save newData into database
    res.status(201).json({ id: doc.id, name: doc.name, email: doc.email, role: doc.role});
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
};


export const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({email:req.body.email}).exec();
    // TODO : this is just temporary, we will use strong password auth
    if (!user) {
      res.status(401).json({message:"no such user email"})
    }
    else if (user.password === req.body.password) {
      // TODO : we wil make dresses independent of login
      res.status(201).json({ id: user.id, email: user.email, role: user.role });
    } else {
      res.status(401).json({message:'invalid credentials'});      
    }
  } catch (err) {
    res.status(400).json(err);
  }
}