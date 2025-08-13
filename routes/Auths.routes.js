import express from "express";
import { checkAuth,createUser,loginUser,} from "../controllers/Auth.controller.js";
import passport from "passport";

const router = express.Router();
router
  .post("/signup", createUser)
  .post("/login", passport.authenticate("local"), loginUser)
  .get("/check", passport.authenticate("jwt"), checkAuth);

export default router;