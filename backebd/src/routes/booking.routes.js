import express from "express";
import { createBooking, getMyBookings, getAllBookings, updateBookingStatus } from "../controllers/booking.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";
const router = express.Router();
router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.get("/", protect, adminOnly, getAllBookings);
router.put("/:id/status", protect, adminOnly, updateBookingStatus);
export default router;
