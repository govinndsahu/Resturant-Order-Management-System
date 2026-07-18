import { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { useLocalStorage } from "../hooks/useLocalStorage";
import { useCart } from "../contexts/Cart";
import { getCategoriesApi } from "../apis/categoryApis";
import { getProductsApi } from "../apis/productsApi";
import { createOrderApi } from "../apis/orderApis";
import { sendNotificationApi } from "../apis/pushSubscriptionApis";

import {
  clearCart,
  getAppVersionFromDB,
  saveAllCategories,
  saveAllProducts,
  saveAppVersion,
} from "../hooks/useIndexedDB";
import { getAppRoute } from "../utils/util";

import LocationError from "./LocationError";
import Tutorial from "./Tutorial";
import LocationErrorMessage from "./LocationErrorMessage";
import { useConfig } from "../contexts/ConfigContext";

const OrderForm = ({ dispalyForm, setDisplayForm, appName }) => {
  const { backendUrl } = useConfig();

  const [name, setName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [showTableValidate, setShowTableValidate] = useState(false);

  const [locationError, setLocationError] = useState(false);
  const [loader, setLoader] = useState(false);

  const [cart, setCart] = useCart();

  const navigate = useNavigate();
  const route = (path = "") => getAppRoute(appName, path);

  const getTotalPrice = () => {
    let total = 0;
    cart.forEach((item) => {
      total += parseInt(item.half_price ? item.half_price : item.full_price);
    });
    return total;
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  };

  const orderData = {
    products: cart.map((item) => {
      return {
        name: item.name,
        category: item.category.name,
        price_type: item.price_type,
        half_price: item.half_price ? item.half_price : "",
        full_price: item.full_price,
        quantity: item.quantity,
      };
    }),
    tableNumber: parseInt(tableNumber),
    buyer: name,
    total: getTotalPrice(),
  };

  const handleDisplayForm = (e) => {
    if (e.target.classList.contains("order-form-overlay")) {
      setDisplayForm(false);
      setShowTableValidate(false);
    }
  };

  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const err = new Error("Geolocation is not supported by this browser.");
        reject(err);
        setLoader(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position);
        },
        (err) => {
          console.error("Error getting location:", err.message);
          reject(err);
          setLoader(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 60000,
          maximumAge: 1000 * 60 * 10,
        },
      );
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (tableNumber === "") {
        setShowTableValidate(true);
        return;
      } else {
        setShowTableValidate(false);
      }

      setLoader(true);

      const position = await getUserLocation();

      const { data } = await createOrderApi(
        {
          ...orderData,
          lat: position?.coords.latitude,
          lng: position?.coords.longitude,
        },
        backendUrl,
      );

      // handling order
      if (data.success) {
        setLoader(false);
        setDisplayForm(false);
        setCart([]);
        await clearCart();
        toast.success("Order placed successfully! 🎉");
        navigate(route());

        await sendNotificationApi(backendUrl);
      }
    } catch (error) {
      setLoader(false);
      if (error.status === 403) {
        setLocationError(true);
      }
    }
  };

  if (!dispalyForm) return null;

  return (
    <>
      <div className="order-form-overlay" onClick={handleDisplayForm}>
        <div className="order-form-modal" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="order-form-header">
            <div className="order-form-icon">
              <i className="ri-restaurant-2-line"></i>
            </div>
            <div className="order-form-title-group">
              <h2>Confirm Your Order</h2>
              <p>
                {getTotalItems()} items · ₹{getTotalPrice()}
              </p>
            </div>
            <button
              className="order-form-close"
              onClick={() => {
                setDisplayForm(false);
                setShowTableValidate(false);
              }}
              aria-label="Close">
              <i className="ri-close-line"></i>
            </button>
          </div>

          {/* Order Summary */}
          <div className="order-form-summary">
            <h3>Order Summary</h3>
            <div className="order-items-list">
              {cart.map((item, idx) => (
                <div key={idx} className="order-item-row">
                  <div className="order-item-info">
                    <span className="order-item-qty">
                      {item.quantity || 1}x
                    </span>
                    <span className="order-item-name">{item.name}</span>
                    {item.size && (
                      <span className="order-item-size">{item.size}</span>
                    )}
                  </div>
                  <span className="order-item-price">
                    ₹{item.half_price || item.full_price}
                  </span>
                </div>
              ))}
            </div>
            <div className="order-form-total">
              <span>Total Amount</span>
              <span className="total-price">₹{getTotalPrice()}</span>
            </div>
          </div>

          {/* Form */}
          <form className="order-form-body" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="order-name">
                <i className="ri-user-line"></i>
                Your Name
              </label>
              <input
                type="text"
                id="order-name"
                placeholder="Enter your name (optional)"
                value={name}
                onChange={(e) => {
                  if (e.target.value === "authpage") {
                    navigate(route("loginpage"));
                  }
                  setName(e.target.value);
                }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="order-table">
                <i className="ri-map-pin-line"></i>
                Table Number <span className="required">*</span>
              </label>
              <input
                type="number"
                id="order-table"
                placeholder="Enter table number"
                value={tableNumber}
                onChange={(e) => {
                  setTableNumber(e.target.value);
                  setShowTableValidate(false);
                }}
                className={showTableValidate ? "error" : ""}
              />
              {showTableValidate && (
                <span className="error-message">
                  <i className="ri-error-warning-line"></i>
                  Table number is required
                </span>
              )}
            </div>

            <div className="order-form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setDisplayForm(false);
                  setShowTableValidate(false);
                }}>
                Cancel
              </button>
              {loader ? (
                <button type="button" className="btn-primary loading" disabled>
                  <span className="btn-spinner"></span>
                  Placing Order...
                </button>
              ) : (
                <button type="submit" className="btn-primary">
                  <i className="ri-check-double-line"></i>
                  Place Order
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {locationError ? (
        <LocationErrorMessage setLocationError={setLocationError} />
      ) : null}
    </>
  );
};

export default OrderForm;
