import Booking from "../models/Booking.model.js";
import Toy from "../models/Toy.model.js";
import User from "../models/User.model.js";

// POST /api/bookings  — create booking
export const createBooking = async (req, res) => {
  try {
    const { toyId, startDate, endDate, paymentMode } = req.body;
    const toy = await Toy.findById(toyId);
    if (!toy || toy.stock < 1)
      return res.status(400).json({ success: false, message: "Toy not available" });

    const days = Math.max(1, Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)));
    const rentalAmount = toy.dailyRate * days;
    const totalAmount = rentalAmount + toy.deposit;

    const user = await User.findById(req.user._id);
    if (paymentMode === "Wallet" && user.wallet < totalAmount)
      return res.status(400).json({ success: false, message: "Insufficient wallet balance" });

    // Deduct wallet & reduce stock
    if (paymentMode === "Wallet") {
      await User.findByIdAndUpdate(req.user._id, { $inc: { wallet: -totalAmount, points: Math.floor(rentalAmount / 10) } });
    }
    await Toy.findByIdAndUpdate(toyId, { $inc: { stock: -1 } });

    const booking = await Booking.create({
      user: req.user._id, toy: toyId, startDate, endDate, days,
      rentalAmount, depositPaid: toy.deposit, totalAmount, paymentMode,
    });

    await booking.populate(["user", "toy"]);
    res.status(201).json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/bookings/my  — logged-in user's bookings
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate("toy").sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/bookings  — all bookings (admin)
export const getAllBookings = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== "All" ? { status } : {};
    const bookings = await Booking.find(filter).populate("user", "name email").populate("toy", "name image category").sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/bookings/:id/status  — update status (admin)
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    if (status === "Returned" && booking.status === "Active") {
      // Restore stock & refund deposit
      await Toy.findByIdAndUpdate(booking.toy, { $inc: { stock: 1 } });
      await User.findByIdAndUpdate(booking.user, { $inc: { wallet: booking.depositPaid } });
      booking.returnedAt = new Date();
    }
    booking.status = status;
    await booking.save();
    await booking.populate(["user", "toy"]);
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
