import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
  name: { type: String},
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true},
  role: { type: String, required: true},
  addresses: { type: [Schema.Types.Mixed]},
  orders: { type: [Schema.Types.Mixed]}
});

const virtual = userSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const User = mongoose.model("User", userSchema);
export default User;