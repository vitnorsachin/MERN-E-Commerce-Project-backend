import User from "../models/User.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
const SECRET_KEY = "SECRET_KEY";

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
          SECRET_KEY
        );
        res
          .cookie("jwt", token, {
            expires: new Date(Date.now() + 3600000),
            httpOnly: true,
          })
          .status(201)
          .json(token);
      }
    );
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
};

export const loginUser = async (req, res) => {
  res
    .cookie("jwt", req.user.token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    })
    .status(201)
    .json(req.user.token);
};

export const checkUser = async (req, res) => {
  res.json({ status: "success", user: req.user });
};