import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: Number, required: true },
  address: { type: String, required: true },
  credits: { type: Number, required: true },
  stocks: { type: Array, required: true },
  
});

const User = mongoose.model("User", UserSchema);

export default User;
