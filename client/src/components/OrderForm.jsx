import { useRef, useState } from "react";

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
  saveAllCategories,
  saveAllProducts,
} from "../hooks/useIndexedDB";

import UpdateApp from "./UpdateApp";
import LocationError from "./LocationError";
import Tutorial from "./Tutorial";
import LocationErrorMessage from "./LocationErrorMessage";

const OrderForm = ({ dispalyForm, setDisplayForm }) => {
  const [name, setName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [showTableValidate, setShowTableValidate] = useState(false);

  const [isUpdated, setIsUpdated] = useState(true);

  const [locationError, setLocationError] = useState(false);

  const [loader, setLoader] = useState(false);

  const [cart, setCart] = useCart();

  const navigate = useNavigate();

  const getTotalPrice = () => {
    let total = 0;
    cart.forEach((item) => {
      total += parseInt(item.half_price ? item.half_price : item.full_price);
    });
    return total;
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
    appVersion: JSON.parse(localStorage.getItem("appVersion"))?.version,
  };

  const handleDisplayForm = (e) => {
    if (e.target.classList.contains("order-form")) {
      setDisplayForm(false);
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

      const { data } = await createOrderApi({
        ...orderData,
        lat: position?.coords.latitude,
        lng: position?.coords.longitude,
      });

      // handling data cache if needed
      if (data.message === "Database is updated.") {
        const {
          data: { products },
        } = await getProductsApi();

        await saveAllProducts(products);

        const {
          data: { categories },
        } = await getCategoriesApi();

        await saveAllCategories(categories);

        localStorage.setItem("appVersion", JSON.stringify(data?.version));

        setIsUpdated(false);

        setLoader(false);
        setDisplayForm(false);
        setCart([]);
        await clearCart();
        navigate("/");
      }

      // handling order
      if (data.success) {
        setLoader(false);
        setDisplayForm(false);
        setCart([]);
        await clearCart();
        toast.success("Ordered successfully.");
        navigate("/");

        await sendNotificationApi();
      }
    } catch (error) {
      setLoader(false);
      if (error.status === 403) {
        setLocationError(true);
      }
    }
  };

  return (
    <>
      <div
        className={`z-3 order-form h-full w-full ${
          dispalyForm ? "flex" : "hidden"
        }`}
        onClick={(e) => handleDisplayForm(e)}>
        <div
          id="form"
          className="w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[50%]">
          <h2>Done Your Order</h2>
          <form action="">
            <div>
              <label htmlFor="#name">Name: (Optional)</label>
              <br /> <br />
              <input
                type="text"
                id="name"
                placeholder="Enter your Name (Optional)"
                value={name}
                onChange={(e) => {
                  if (e.target.value === "authpage") {
                    navigate("/loginpage");
                  }
                  setName(e.target.value);
                }}
              />
            </div>
            <div className="relative">
              <label htmlFor="#table-number">Table No:</label> <br />
              <span
                className="table-no-validate"
                style={{ display: `${showTableValidate ? "unset" : "none"}` }}>
                Table No. is Required
              </span>
              <br />
              <input
                max={2}
                type="number"
                id="table-number"
                placeholder="Enter your Table No."
                value={tableNumber}
                onChange={(e) => {
                  setTableNumber(e.target.value);
                  setShowTableValidate(false);
                }}
              />
            </div>
            <div>
              {loader ? (
                <span className="loader"></span>
              ) : (
                <input
                  type="button"
                  id="confirm-btn"
                  value={"Order"}
                  onClick={(e) => handleSubmit(e)}
                />
              )}
            </div>
          </form>
        </div>
      </div>
      {!isUpdated ? <UpdateApp /> : null}
      {locationError ? (
        <LocationErrorMessage setLocationError={setLocationError} />
      ) : null}
    </>
  );
};

export default OrderForm;
