import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import ProceedContainer from "../components/ProceedContainer";
import OrderForm from "../components/OrderForm";

import { useCart } from "../contexts/Cart";

import {
  saveAllCartItems,
  updateCartQuantity,
  removeFromCart,
  getCart,
} from "../hooks/useIndexedDB";

const CartPage = () => {
  const [cart, setCart] = useCart();
  const [displayForm, setDisplayForm] = useState(false);

  const handleRemoveCart = async (cartItemId) => {
    try {
      await removeFromCart(cartItemId);
      const updatedCart = await getCart();
      setCart(updatedCart);
      toast.success("Removed from cart!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to remove from cart");
    }
  };

  const handleIncreaseQuantity = async (cartItemId) => {
    try {
      const item = cart.find((item) => item._id === cartItemId);
      if (item) {
        const newQuantity = (item.quantity || 1) + 1;
        await updateCartQuantity(cartItemId, newQuantity);
        const updatedCart = await getCart();
        setCart(updatedCart);
        toast.success("Quantity increased!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update quantity");
    }
  };

  const handleDecreaseQuantity = async (cartItemId) => {
    try {
      const item = cart.find((item) => item._id === cartItemId);
      if (item) {
        const newQuantity = (item.quantity || 1) - 1;
        if (newQuantity <= 0) {
          await removeFromCart(cartItemId);
          toast.success("Removed from cart!");
        } else {
          await updateCartQuantity(cartItemId, newQuantity);
          toast.success("Quantity decreased!");
        }
        const updatedCart = await getCart();
        setCart(updatedCart);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update quantity");
    }
  };

  return (
    <>
      <div id="cart-page" className="products-container">
        {cart?.length ? (
          cart
            ?.slice()
            .reverse()
            .map((p, i) => (
              <div key={i} className="product">
                <div className="product-image">
                  <img
                    src={`data:${p.mimeType};base64,${p.image}`}
                    alt={p.name}
                  />
                </div>
                <div className="product-info">
                  <h2 className="product-name">
                    {p.size === "half"
                      ? "Half"
                      : p.size === "full"
                        ? "Full"
                        : ""}{" "}
                    {p.name}
                  </h2>
                  <div className="flex justify-center gap-5">
                    <p>
                      Rs.
                      {p.half_price ? p.half_price : p.full_price}
                    </p>
                    <p>{p.category?.name}</p>
                  </div>
                  <div className="cart-buttons">
                    <button
                      onClick={() => handleDecreaseQuantity(p._id)}
                      id="decrease-button">
                      −
                    </button>
                    <span className="text-lg font-semibold">
                      Qty: {p.quantity || 1}
                    </span>
                    <button
                      onClick={() => handleIncreaseQuantity(p._id)}
                      id="increase-button">
                      +
                    </button>
                  </div>
                  <div className="remove-btn">
                    <button
                      onClick={async (e) => {
                        await handleRemoveCart(p._id);
                      }}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <span>Cart is empty!</span>
        )}
      </div>
      <footer>
        <ProceedContainer setDisplayForm={setDisplayForm} />
      </footer>
      <OrderForm dispalyForm={displayForm} setDisplayForm={setDisplayForm} />
    </>
  );
};

export default CartPage;
