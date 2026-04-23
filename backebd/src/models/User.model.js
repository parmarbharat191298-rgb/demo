import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone:    { type: String, default: "" },
  role:     { type: String, enum: ["user", "admin"], default: "user" },
  wallet:   { type: Number, default: 0 },
  points:   { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  avatar:   { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
