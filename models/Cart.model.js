import mongoose from "mongoose";
import { Schema } from "mongoose";

const cartSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
});

const virtual = cartSchema.virtual("id");
virtual.get(function () { return this._id;});
cartSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {delete ret._id;},
});

const Cart = mongoose.model("Cart", cartSchema);  // create model
export default Cart; // export model