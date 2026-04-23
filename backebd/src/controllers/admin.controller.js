import User from "../models/User.model.js";
import Toy from "../models/Toy.model.js";
import Booking from "../models/Booking.model.js";

// GET /api/admin/stats
export const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalToys, allBookings] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Toy.countDocuments({ isActive: true }),
      Booking.find().populate("toy", "category"),
    ]);

    const totalRevenue     = allBookings.reduce((s, b) => s + b.rentalAmount, 0);
    const activeBookings   = allBookings.filter(b => b.status === "Active").length;
    const overdueBookings  = allBookings.filter(b => b.status === "Overdue").length;
    const depositHeld      = allBookings.filter(b => ["Active", "Overdue"].includes(b.status)).reduce((s, b) => s + b.depositPaid, 0);

    const revenueByCategory = allBookings.reduce((acc, b) => {
      const cat = b.toy?.category || "Other";
      acc[cat] = (acc[cat] || 0) + b.rentalAmount;
      return acc;
    }, {});

    res.json({ success: true, stats: { totalUsers, totalToys, totalRevenue, activeBookings, overdueBookings, depositHeld, totalBookings: allBookings.length, revenueByCategory } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
