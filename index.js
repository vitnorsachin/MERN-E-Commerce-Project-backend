import dotenv from "dotenv";
dotenv.config();
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
import cookieParser from "cookie-parser";

import productsRouter from "./routes/Products.routes.js";
import brandsRouter from "./routes/Brands.routes.js";
import categoriesRouter from "./routes/Categories.routes.js";
import usersRouter from "./routes/Users.routes.js";
import authRouter from "./routes/Auths.routes.js";
import cartRouter from "./routes/Cart.routes.js";
import ordersRouter from "./routes/Order.routes.js";
import User from "./models/User.model.js";
import { cookieExtractor, isAuth, sanitizeUser } from "./services/common.service.js";
import path from "path";

// JWT options
const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET_KEY; // TODO : should not be in code;

// middlewares
server.use(express.static(path.resolve("dist")));
server.use(cookieParser());
server.use(
  session({ secret: process.env.SESSION_KEY, resave: false, saveUninitialized: false })
);
server.use(passport.initialize());
server.use(passport.session());
server.use(cors());
server.use(express.json());
server.use("/products", isAuth(), productsRouter);
server.use("/brands", isAuth(), brandsRouter);
server.use("/categories", isAuth(), categoriesRouter);
server.use("/users", isAuth(), usersRouter);
server.use("/auth", authRouter);
server.use("/cart", isAuth(), cartRouter);
server.use("/orders", isAuth(), ordersRouter);

// Passport Strategies
passport.use(
  "local",
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async function (email, password, done) {
      try {
        const user = await User.findOne({ email });
        console.log(email," : ", password);
        console.log({ user });
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
            const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET_KEY);// sub keyword take my 2 hours to solve this (before "sub" it has "id");
            // const token = jwt.sign(sanitizeUser(user), process.env.JWT_SECRET_KEY);
            // console.log("Token: ", token);
            done(null, {id: user.id, role: user.role, token});
          }
        );
      } catch (err) {
        return done(err);
      }
    }
  )
);

// JWT Strategies
// passport.use(
//   "jwt",
//   new JwtStrategy(opts, async function (jwt_payload, done) {
//     try {
//       console.log({ jwt_payload });
//       const user = await User.findById(jwt_payload.sub);
//       if (user) {
//         return done(null, sanitizeUser(user)); // this call serializer
//       } else {
//         return done(null, false); // or you could create a new account
//       }
//     } catch (err) {
//       return done(err, false);
//     }
//   })
// );
passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      console.log({ jwt_payload });
      const userId = jwt_payload.sub || jwt_payload.id; // support both
      const user = await User.findById(userId);
      if (user) return done(null, sanitizeUser(user));
      return done(null, false);
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


// Payments
// This is your test secret API key.
import Stripe from "stripe";
const stripe = Stripe(process.env.STRIPE_SERVER_KEY);
server.post('/create-payment-intent', async (req, res) => {
  const { totalAmount, orderId } = req.body;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100, // for decimal compensation
    currency: 'inr',
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      orderId,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});


try {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("Database connected");
} catch (error) {
  console.error(error);
}

server.use((req, res) => {
  res.status(404).send(`
    <h1 style='text-align:center; color:red; margin-top:100px'>
    404 - Page Not Found</h1>
  `);
});

server.listen(process.env.PORT, () => {
  console.log(`Server started : http://localhost:${process.env.PORT}`);
});