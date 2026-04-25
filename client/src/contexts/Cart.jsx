import React, { createContext, useContext, useEffect, useState } from "react";
import { getCart } from "../hooks/useIndexedDB";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      const existingCart = await getCart();
      if (existingCart) {
        setCart(existingCart);
      }
    };
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={[cart, setCart]}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => useContext(CartContext);

export { CartProvider, useCart };
