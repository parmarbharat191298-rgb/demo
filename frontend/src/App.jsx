import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";

// User Pages
import HomePage       from "./pages/HomePage.jsx";
import BrowsePage     from "./pages/BrowsePage.jsx";
import ToyDetailPage  from "./pages/ToyDetailPage.jsx";
import CartPage       from "./pages/CartPage.jsx";
import CheckoutPage   from "./pages/CheckoutPage.jsx";
import BookingsPage   from "./pages/BookingsPage.jsx";
import ProfilePage    from "./pages/ProfilePage.jsx";
import LoginPage      from "./pages/LoginPage.jsx";
import RegisterPage   from "./pages/RegisterPage.jsx";

// Admin Pages
import AdminLayout        from "./pages/admin/AdminLayout.jsx";
import AdminDashboard     from "./pages/admin/AdminDashboard.jsx";
import AdminToys          from "./pages/admin/AdminToys.jsx";
import AdminBookings      from "./pages/admin/AdminBookings.jsx";
import AdminUsers         from "./pages/admin/AdminUsers.jsx";
import AdminRevenue       from "./pages/admin/AdminRevenue.jsx";

// Layout
import Navbar from "./components/common/Navbar.jsx";
import Footer from "./components/common/Footer.jsx";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner" />;
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner" />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

function UserLayout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "calc(100vh - 140px)" }}>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* ── Public / User Routes ── */}
          <Route path="/" element={<UserLayout><HomePage /></UserLayout>} />
          <Route path="/browse" element={<UserLayout><BrowsePage /></UserLayout>} />
          <Route path="/toy/:id" element={<UserLayout><ToyDetailPage /></UserLayout>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ── Protected User Routes ── */}
          <Route path="/cart" element={<PrivateRoute><UserLayout><CartPage /></UserLayout></PrivateRoute>} />
          <Route path="/checkout" element={<PrivateRoute><UserLayout><CheckoutPage /></UserLayout></PrivateRoute>} />
          <Route path="/bookings" element={<PrivateRoute><UserLayout><BookingsPage /></UserLayout></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><UserLayout><ProfilePage /></UserLayout></PrivateRoute>} />

          {/* ── Admin Routes ── */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="toys"     element={<AdminToys />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="users"    element={<AdminUsers />} />
            <Route path="revenue"  element={<AdminRevenue />} />
          </Route>

          {/* ── 404 ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}
