import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import { Strategy as LocalStrategy } from "passport-local";
import crypto from "crypto";
import { Strategy as JwtStrategy } from "passport-jwt";
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

import path, { dirname } from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const server = express();
dotenv.config();

// ---------- Middleware ----------
server.use(cors());
server.use(express.json());
server.use(cookieParser());
server.use(session({ secret: process.env.SESSION_KEY, resave: false, saveUninitialized: false }));
server.use(passport.initialize());
server.use(passport.session());

// ---------- Serve Frontend ----------
server.use(express.static(path.join(__dirname, "dist")));

// ---------- API Routes ----------
server.use("/api/products", isAuth(), productsRouter);
server.use("/api/brands", isAuth(), brandsRouter);
server.use("/api/categories", isAuth(), categoriesRouter);
server.use("/api/users", isAuth(), usersRouter);
server.use("/api/auth", authRouter);
server.use("/api/cart", isAuth(), cartRouter);
server.use("/api/orders", isAuth(), ordersRouter);

// ---------- Passport Strategies ----------
passport.use(
  "local",
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        // console.log(email," : ", password);
        // console.log({ user });
        if (!user) return done(null, false, { message: "Invalid credentials" });

        crypto.pbkdf2(password, user.salt, 310000, 32, "sha256", (err, hashedPassword) => {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: "Invalid credentials" });
          }
          const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET_KEY);
          // console.log("Token: ", token);
          done(null, { id: user.id, role: user.role, token });
        });
      } catch (err) {
        return done(err);
      }
    }
  )
);

const opts = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET_KEY,
};
passport.use(
  "jwt",
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      // console.log({ jwt_payload });
      const userId = jwt_payload.sub || jwt_payload.id;
      const user = await User.findById(userId);
      if (user) return done(null, sanitizeUser(user));
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  })
);

passport.serializeUser((user, cb) => {
  // console.log("serialize: ", user);
  process.nextTick(() => cb(null, { id: user.id, role: user.role }))
});
passport.deserializeUser((user, cb) => {
  // console.log("deserialize: ", user); 
  process.nextTick(() => cb(null, user))
});

// ---------- Payments ----------
const stripe = Stripe(process.env.STRIPE_SERVER_KEY);
server.post("/api/create-payment-intent", async (req, res) => {
  const { totalAmount, orderId } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100,
    currency: "inr",
    automatic_payment_methods: { enabled: true },
    metadata: { orderId },
  });

  res.send({ clientSecret: paymentIntent.client_secret });
});

// ---------- MongoDB ----------
try {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("Database connected");
} catch (error) {
  console.error(error);
}

// ---------- SPA Catch-All (Fix for refresh issues) ----------
server.get(
  /^(?!\/api).*/, // Match everything except paths starting with /api
  (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  }
);

// ---------- 404 Handler ----------
server.use((req, res) => {
  res.status(404).send(`
    <h1 style='text-align:center; color:red; margin-top:100px'>
    404 - Page Not Found</h1>
  `);
});

// ---------- Start Server ----------
server.listen(process.env.PORT, () => {
  console.log(`Server started: http://localhost:${process.env.PORT}`);
});