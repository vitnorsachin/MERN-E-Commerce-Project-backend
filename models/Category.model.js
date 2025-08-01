import mongoose from "mongoose";
import { Schema } from "mongoose";

const categorySchema = new Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
});

const virtual = categorySchema.virtual("id");
virtual.get(function () {
  return this._id;
});
categorySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Category = mongoose.model("Category", categorySchema);
export default Category;