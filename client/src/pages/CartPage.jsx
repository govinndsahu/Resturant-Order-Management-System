import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import ProceedContainer from "../components/ProceedContainer";
import OrderForm from "../components/OrderForm";

import { useCart } from "../contexts/Cart";

import {
  updateCartQuantity,
  removeFromCart,
  getCart,
} from "../hooks/useIndexedDB";

const CartPage = ({ appName }) => {
  const [cart, setCart] = useCart();
  const [displayForm, setDisplayForm] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const navigate = useNavigate();

  const getTotalPrice = () => {
    let total = 0;
    cart.forEach((item) => {
      total +=
        parseInt(item.half_price ? item.half_price : item.full_price) *
        (item.quantity || 1);
    });
    return total;
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  };

  const handleRemoveCart = async (cartItemId) => {
    try {
      setRemovingId(cartItemId);
      await new Promise((resolve) => setTimeout(resolve, 200)); // Small delay for animation
      await removeFromCart(cartItemId);
      const updatedCart = await getCart();
      setCart(updatedCart);
      setRemovingId(null);
      toast.success("Removed from cart!");
    } catch (error) {
      console.log(error);
      setRemovingId(null);
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
          await handleRemoveCart(cartItemId);
        } else {
          await updateCartQuantity(cartItemId, newQuantity);
          const updatedCart = await getCart();
          setCart(updatedCart);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update quantity");
    }
  };

  if (!cart?.length) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <div className="cart-empty-icon">
            <i className="ri-shopping-basket-line"></i>
          </div>
          <h2>Your cart is empty</h2>
          <p>Browse our menu and add some delicious items!</p>
          <button className="cart-empty-btn" onClick={() => navigate(-1)}>
            <i className="ri-arrow-left-line"></i>
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {/* Header */}
      <div className="cart-header">
        <button className="cart-back-btn" onClick={() => navigate(-1)}>
          <i className="ri-arrow-left-line"></i>
        </button>
        <div className="cart-header-info">
          <h1>Your Cart</h1>
          <span>{getTotalItems()} items</span>
        </div>
        <div className="cart-header-total">
          <span className="cart-total-label">Total</span>
          <span className="cart-total-amount">₹{getTotalPrice()}</span>
        </div>
      </div>

      {/* Cart Items */}
      <div className="cart-items">
        {cart
          .slice()
          .reverse()
          .map((item, index) => (
            <div
              key={item._id + item.size}
              className={`cart-item ${removingId === item._id ? "removing" : ""}`}
              style={{ animationDelay: `${index * 0.05}s` }}>
              {/* Item Image */}
              <div className="cart-item-image">
                <img src={item.image} alt={item.name} />
              </div>

              {/* Item Details */}
              <div className="cart-item-details">
                <div className="cart-item-header">
                  <h3 className="cart-item-name">
                    {item.size === "half" && (
                      <span className="size-badge half">Half</span>
                    )}
                    {item.size === "full" && (
                      <span className="size-badge full">Full</span>
                    )}
                    {item.name}
                  </h3>
                  <button
                    className="cart-item-remove"
                    onClick={() => handleRemoveCart(item._id)}
                    aria-label="Remove item">
                    <i className="ri-delete-bin-6-line"></i>
                  </button>
                </div>

                <p className="cart-item-category">{item.category?.name}</p>

                <div className="cart-item-footer">
                  {/* Quantity Controls */}
                  <div className="cart-qty-control">
                    <button
                      className="qty-btn minus"
                      onClick={() => handleDecreaseQuantity(item._id)}
                      aria-label="Decrease quantity">
                      <i className="ri-subtract-line"></i>
                    </button>
                    <span className="qty-value">{item.quantity || 1}</span>
                    <button
                      className="qty-btn plus"
                      onClick={() => handleIncreaseQuantity(item._id)}
                      aria-label="Increase quantity">
                      <i className="ri-add-line"></i>
                    </button>
                  </div>

                  {/* Price */}
                  <div className="cart-item-price">
                    <span className="price-per">
                      ₹{item.half_price || item.full_price} each
                    </span>
                    <span className="price-total">
                      ₹
                      {(item.half_price || item.full_price) *
                        (item.quantity || 1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Order Summary */}
      <div className="cart-summary">
        <h3>Order Summary</h3>
        <div className="summary-row">
          <span>Subtotal ({getTotalItems()} items)</span>
          <span>₹{getTotalPrice()}</span>
        </div>
        <div className="summary-row">
          <span>Taxes & Fees</span>
          <span className="free">Included</span>
        </div>
        <div className="summary-divider"></div>
        <div className="summary-row total">
          <span>Total Amount</span>
          <span>₹{getTotalPrice()}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="cart-footer">
        <ProceedContainer setDisplayForm={setDisplayForm} />
      </div>

      {/* Order Form Modal */}
      <OrderForm
        dispalyForm={displayForm}
        setDisplayForm={setDisplayForm}
        appName={appName}
      />
    </div>
  );
};

export default CartPage;
