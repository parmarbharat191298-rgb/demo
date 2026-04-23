import mongoose from "mongoose";

const toySchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  category:    { type: String, required: true, enum: ["Building Sets", "Dolls", "Vehicles", "Action Toys", "Creative Play", "Educational", "Outdoor"] },
  dailyRate:   { type: Number, required: true },
  deposit:     { type: Number, required: true },
  stock:       { type: Number, required: true, default: 0 },
  age:         { type: String, required: true },
  image:       { type: String, default: "🧸" },
  description: { type: String, default: "" },
  features:    [{ type: String }],
  rating:      { type: Number, default: 4.5, min: 0, max: 5 },
  reviews:     { type: Number, default: 0 },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

toySchema.virtual("available").get(function () {
  return this.stock > 0;
});

toySchema.set("toJSON", { virtuals: true });

export default mongoose.model("Toy", toySchema);
