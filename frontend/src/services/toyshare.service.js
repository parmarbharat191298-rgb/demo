import api from "./api.js";

// ── Toys ──────────────────────────────────────────────────────────────────────
export const toyService = {
  getAll:   (params) => api.get("/toys", { params }),
  getById:  (id)     => api.get(`/toys/${id}`),
  create:   (data)   => api.post("/toys", data),
  update:   (id, data) => api.put(`/toys/${id}`, data),
  delete:   (id)     => api.delete(`/toys/${id}`),
};

// ── Bookings ──────────────────────────────────────────────────────────────────
export const bookingService = {
  create:       (data)         => api.post("/bookings", data),
  getMy:        ()             => api.get("/bookings/my"),
  getAll:       (params)       => api.get("/bookings", { params }),
  updateStatus: (id, status)   => api.put(`/bookings/${id}/status`, { status }),
};

// ── Users ─────────────────────────────────────────────────────────────────────
export const userService = {
  getProfile:   ()       => api.get("/users/profile"),
  updateProfile:(data)   => api.put("/users/profile", data),
  addWallet:    (amount) => api.post("/users/wallet/add", { amount }),
  getAll:       ()       => api.get("/users"),
  toggleStatus: (id)     => api.put(`/users/${id}/toggle`),
};

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminService = {
  getStats: () => api.get("/admin/stats"),
};
