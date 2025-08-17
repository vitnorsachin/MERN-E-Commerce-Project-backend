import User from "../models/User.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
  try {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        const user = new User({ ...req.body, password: hashedPassword, salt });
        const newUser = await user.save();

        const token = jwt.sign(
          { sub: newUser._id, role: newUser.role },// sub keyword take my 2 hours to solve this (before "sub" it has "id")
          process.env.JWT_SECRET_KEY
        );
        res
          .cookie("jwt", token, {
            expires: new Date(Date.now() + 3600000),
            httpOnly: true,
          })
          .status(201)
          // .json(token);
          .json({id: newUser.id, role: newUser.role});
      }
    );
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
};

export const loginUser = async (req, res) => {
  const user = req.user;
  res
    .cookie('jwt', user.token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    })
    .status(201)
    .json({ id: user.id, role: user.role });
};

export const checkAuth = async (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.sendStatus(401);
  }
};