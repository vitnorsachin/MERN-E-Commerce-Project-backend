import express from "express";
const server = express();
import mongoose from "mongoose";
import { createProduct } from "./controller/Product.js";
import productsRouter from "./routes/Products.js";
import brandsRouter from "./routes/Brands.js"
import categoriesRouter from "./routes/Categories.js"
import cors from 'cors'

// middlewares
server.use(cors())
server.use(express.json());
server.use("/products", productsRouter)
server.use("/brands", brandsRouter)
server.use("/categories", categoriesRouter)

try {
  await mongoose.connect(`mongodb://localhost:27017/ecommerce`);
  console.log("Database connected");
} catch (error) {
  console.error(error);
}

server.get("/", (req, res) => {
  res.send(`<h1>E-commerce Project</h1>`);
});

server.post("/products", (req, res) => createProduct(req, res));

server.listen(8080, () => {
  console.log(`Server started : http://localhost:8080`);
});