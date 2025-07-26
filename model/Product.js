import mongoose from "mongoose";
import { Schema } from "mongoose";

const productSchema = new Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: {
    type: Number,
    min: [0, "wrong min price"],
    max: [100000, "price is greter than $100000"],
    required: true,
  },
  discountPercentage: {
    type: Number,
    min: [0, "wrong min discount"],
    max: [99, "wrong max discount"],
    required: true,
  },
  rating: {
    type: Number,
    min: [0, "wrong min rating"],
    max: [5, "wrong max rating"],
    default: 0,
  },
  stock: { type: Number, min: [0, "wrong min stock"], required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  thumbnail: { type: String, required: true },
  images: { type: [String], required: true },
  deleted: { type: Boolean, default: false },
});

const virtual = productSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
productSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Product = mongoose.model("Product", productSchema);  // create model
export default Product; // export model