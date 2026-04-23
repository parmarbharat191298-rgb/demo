import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  toy:         { type: mongoose.Schema.Types.ObjectId, ref: "Toy",  required: true },
  startDate:   { type: Date, required: true },
  endDate:     { type: Date, required: true },
  days:        { type: Number, required: true },
  rentalAmount:{ type: Number, required: true },
  depositPaid: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  paymentMode: { type: String, enum: ["Wallet", "UPI", "Card", "Cash"], default: "Wallet" },
  status:      { type: String, enum: ["Active", "Returned", "Overdue", "Cancelled"], default: "Active" },
  returnedAt:  { type: Date },
  notes:       { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
