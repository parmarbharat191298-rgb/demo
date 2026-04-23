import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import User from "../models/User.model.js";
import Toy from "../models/Toy.model.js";

dotenv.config();

const users = [
  { name: "Admin", email: "admin@toyshare.in", password: "admin123", phone: "9876543210", role: "admin", wallet: 5000, points: 0 },
  { name: "Riya Shah", email: "riya@gmail.com", password: "user123", phone: "9876541234", wallet: 1200, points: 320 },
  { name: "Arjun Mehta", email: "arjun@gmail.com", password: "user123", phone: "9988776655", wallet: 800, points: 110 },
  { name: "Karan Joshi", email: "karan@gmail.com", password: "user123", phone: "9090909090", wallet: 3100, points: 900 },
];

const toys = [
  { name: "LEGO Star Wars Millennium Falcon", category: "Building Sets", dailyRate: 50, deposit: 500, stock: 3, age: "9+", image: "🚀", rating: 4.9, reviews: 234, description: "Build the iconic Millennium Falcon with 1351 pieces", features: ["1351 pieces", "7 minifigures", "Opening cockpit", "Rotating gun turrets"] },
  { name: "Barbie Dreamhouse", category: "Dolls", dailyRate: 40, deposit: 400, stock: 5, age: "3+", image: "🏠", rating: 4.7, reviews: 189, description: "Three-story dreamhouse with pool and elevator", features: ["3 floors", "8 rooms", "Working elevator", "Pool slide"] },
  { name: "Hot Wheels Ultimate Garage", category: "Vehicles", dailyRate: 30, deposit: 300, stock: 0, age: "5+", image: "🏎️", rating: 4.8, reviews: 156, description: "Multi-level garage with car elevator and race tracks", features: ["Holds 140+ cars", "Motorized elevator", "2 car launchers"] },
  { name: "Nerf Ultra One Blaster", category: "Action Toys", dailyRate: 25, deposit: 200, stock: 8, age: "8+", image: "🎯", rating: 4.6, reviews: 287, description: "Motorized blaster with ultra dart technology", features: ["Fires 120 feet", "25-dart drum", "Motorized"] },
  { name: "Play-Doh Kitchen Creations", category: "Creative Play", dailyRate: 15, deposit: 150, stock: 12, age: "3+", image: "🎨", rating: 4.5, reviews: 342, description: "Ultimate kitchen playset with 40+ accessories", features: ["40+ accessories", "5 Play-Doh colors", "Oven & mixer"] },
  { name: "Remote Control Excavator", category: "Vehicles", dailyRate: 35, deposit: 350, stock: 4, age: "6+", image: "🚜", rating: 4.7, reviews: 198, description: "Full-function RC excavator with working lights", features: ["360° rotation", "Working lights", "2.4GHz remote"] },
  { name: "Baby Alive Potty Dance", category: "Dolls", dailyRate: 20, deposit: 180, stock: 6, age: "3+", image: "👶", rating: 4.4, reviews: 267, description: "Interactive baby doll that drinks and uses potty", features: ["Drinks water", "Uses potty", "Sings & dances"] },
  { name: "LEGO Technic Bugatti", category: "Building Sets", dailyRate: 70, deposit: 800, stock: 2, age: "16+", image: "🏎️", rating: 4.9, reviews: 145, description: "Ultimate LEGO Technic supercar with 3599 pieces", features: ["3599 pieces", "Working gearbox", "W16 engine"] },
];

const seed = async () => {
  await connectDB();
  await User.deleteMany();
  await Toy.deleteMany();

  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, 10);
    await User.create({ ...u, password: hashed });
  }
  await Toy.insertMany(toys);

  console.log("✅ Database seeded successfully!");
  console.log("👤 Admin: admin123@gmail.com / admin123");
  console.log("👤 User:  riya@gmail.com / user123");
  process.exit(0);
};

seed();
