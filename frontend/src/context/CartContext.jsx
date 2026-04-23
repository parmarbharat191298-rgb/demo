import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (toy, days = 3) => {
    setCart(prev => {
      const exists = prev.find(i => i._id === toy._id);
      if (exists) return prev.map(i => i._id === toy._id ? { ...i, days: i.days + days } : i);
      return [...prev, { ...toy, days }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i._id !== id));

  const updateDays = (id, days) =>
    setCart(prev => prev.map(i => i._id === id ? { ...i, days: Math.max(1, days) } : i));

  const clearCart = () => setCart([]);

  const cartTotal   = cart.reduce((s, i) => s + i.dailyRate * i.days, 0);
  const depositTotal= cart.reduce((s, i) => s + i.deposit, 0);
  const totalAmount = cartTotal + depositTotal;
  const cartCount   = cart.length;

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateDays, clearCart, cartTotal, depositTotal, totalAmount, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
