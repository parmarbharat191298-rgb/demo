import Toy from "../models/Toy.model.js";

// GET /api/toys
export const getAllToys = async (req, res) => {
  try {
    const { category, search, available } = req.query;
    const filter = { isActive: true };
    if (category && category !== "All") filter.category = category;
    if (search) filter.name = { $regex: search, $options: "i" };
    if (available === "true") filter.stock = { $gt: 0 };

    const toys = await Toy.find(filter).sort({ rating: -1 });
    res.json({ success: true, count: toys.length, toys });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/toys/:id
export const getToyById = async (req, res) => {
  try {
    const toy = await Toy.findById(req.params.id);
    if (!toy) return res.status(404).json({ success: false, message: "Toy not found" });
    res.json({ success: true, toy });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/toys  (admin)
export const createToy = async (req, res) => {
  try {
    const toy = await Toy.create(req.body);
    res.status(201).json({ success: true, toy });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/toys/:id  (admin)
export const updateToy = async (req, res) => {
  try {
    const toy = await Toy.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!toy) return res.status(404).json({ success: false, message: "Toy not found" });
    res.json({ success: true, toy });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/toys/:id  (admin)
export const deleteToy = async (req, res) => {
  try {
    await Toy.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: "Toy removed" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
