import express from "express";
const server = express();
import mongoose from "mongoose";
import cors from 'cors';

import productsRouter from "./routes/Products.routes.js"
import brandsRouter from "./routes/Brands.routes.js"
import categoriesRouter from "./routes/Categories.routes.js"
import usersRouter  from "./routes/Users.routes.js"
import authRouter  from "./routes/Auths.routes.js"
import cartRouter from "./routes/Cart.routes.js"
import ordersRouter from "./routes/Order.routes.js"

// middlewares
server.use(cors())
server.use(express.json());
server.use("/products", productsRouter)
server.use("/brands", brandsRouter)
server.use("/categories", categoriesRouter)
server.use("/users", usersRouter)
server.use("/auth", authRouter)
server.use("/cart", cartRouter)
server.use("/orders", ordersRouter)


try {
  await mongoose.connect(`mongodb://localhost:27017/ecommerce`);
  console.log("Database connected");
} catch (error) {
  console.error(error);
}

server.get("/", (req, res) => {
  res.send(`<h1>E-commerce Project Testing</h1>`);
});

server.use((_, res) =>{
  res.status(404).send("<h1>404 - Page Not Found</h1>")
});

server.listen(8080, () => {
  console.log(`Server started : http://localhost:8080`);
});