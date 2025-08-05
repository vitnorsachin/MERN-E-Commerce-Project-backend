import express from "express";
const server = express();
import mongoose from "mongoose";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import { Strategy as LocalStrategy } from "passport-local";
import crypto from "crypto";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import jwt from "jsonwebtoken";

import productsRouter from "./routes/Products.routes.js";
import brandsRouter from "./routes/Brands.routes.js";
import categoriesRouter from "./routes/Categories.routes.js";
import usersRouter from "./routes/Users.routes.js";
import authRouter from "./routes/Auths.routes.js";
import cartRouter from "./routes/Cart.routes.js";
import ordersRouter from "./routes/Order.routes.js";
import User from "./models/User.model.js";
import { isAuth, sanitizeUser } from "./services/common.service.js";

const SECRET_KEY = "SECRET_KEY";
// JWT options
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SECRET_KEY; // TODO : should not be in code;

// middlewares
server.use(
  session({ secret: "keyboad cat", resave: false, saveUninitialized: false })
);

server.use(passport.initialize());
server.use(passport.session());
server.use(cors());
server.use(express.json());
server.use("/products", isAuth(), productsRouter);
server.use("/brands", brandsRouter);
server.use("/categories", categoriesRouter);
server.use("/users", usersRouter);
server.use("/auth", authRouter);
server.use("/cart", cartRouter);
server.use("/orders", ordersRouter);

// Passport Strategies
// server.use(passport.authenticate("session"));
passport.use(
  "local",
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async function (email, password, done) {
      try {
        const user = await User.findOne({ email }).exec();
        if (!user) return done(null, false, { message: "Invalid credentials" });
        crypto.pbkdf2(
          password,
          user.salt,
          310000,
          32,
          "sha256",
          async function (err, hashedPassword) {
            if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
              return done(null, false, { message: "Invalid credentials" });
            }
            const token = jwt.sign({ sub: user._id, role: user.role }, SECRET_KEY); // 🟢 
            done(null, token);
          }
        );
      } catch (err) {
        return done(err);
      }
    }
  )
);

// JWT Strategies
passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      console.log({ jwt_payload });
      const user = await User.findById(jwt_payload.sub); // 🟢 
      if (user) {
        return done(null, sanitizeUser(user));  // this call serializer
      } else {
        return done(null, false); // or you could create a new account
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

passport.serializeUser(function (user, cb) {
  // this create session variable req.user on being called from callback
  console.log("serialize: ", user);
  process.nextTick(function () {
    cb(null, { id: user.id, role: user.role });
  });
});
passport.deserializeUser(function (user, cb) {
  // this changes creates sesssion variable req.user when called from authrized request
  console.log("deserialize: ", user);
  process.nextTick(function () {
    return cb(null, user);
  });
});

try {
  await mongoose.connect(`mongodb://localhost:27017/ecommerce`);
  console.log("Database connected");
} catch (error) {
  console.error(error);
}

server.get("/", (req, res) => {
  res.send(`<h1>E-commerce Project Testing</h1>`);
});

server.use((req, res) => {
  res.status(404).send("<h1>404 - Page Not Found</h1>");
});

server.listen(8080, () => {
  console.log(`Server started : http://localhost:8080`);
});