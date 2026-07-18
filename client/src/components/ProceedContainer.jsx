import { useState } from "react";
import { useCart } from "../contexts/Cart";
import LocationError from "./LocationError";
import Tutorial from "./Tutorial";
import { useLocalStorage } from "../hooks/useLocalStorage";

const ProceedContainer = ({ setDisplayForm }) => {
  const [cart] = useCart();
  const [locationError, setLocationError] = useLocalStorage(
    "isLocation",
    false,
  );
  const [showTutorial, setShowTutorial] = useState(false);
  const [loader, setLoader] = useState(false);

  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const err = new Error("Geolocation is not supported by this browser.");
        reject(err);
        setShowTutorial(true);
        setLocationError(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position);
          setLocationError(false);
        },
        (err) => {
          reject(err);
          setShowTutorial(true);
          setLocationError(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 60000,
          maximumAge: 1000 * 60 * 15,
        },
      );
    });
  };

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

  const handleDisplayForm = async () => {
    const permissionStatus = await navigator.permissions.query({
      name: "geolocation",
    });

    if (
      permissionStatus.state === "denied" ||
      permissionStatus.state === "prompt"
    ) {
      setLocationError(true);
      return;
    }

    setLoader(true);
    await getUserLocation();
    setLoader(false);
    setDisplayForm(true);
  };

  if (!cart?.length) return null;

  return (
    <>
      <div className="proceed-bar">
        <div className="proceed-info">
          <div className="proceed-items">
            <i className="ri-shopping-bag-3-line"></i>
            <span>{getTotalItems()} items</span>
          </div>
          <div className="proceed-total">
            <span className="total-label">Total</span>
            <span className="total-amount">₹{getTotalPrice()}</span>
          </div>
        </div>

        {loader ? (
          <button className="proceed-btn loading" disabled>
            <span className="btn-loader"></span>
            Locating...
          </button>
        ) : (
          <button className="proceed-btn" onClick={handleDisplayForm}>
            Place Order
            <i className="ri-arrow-right-line"></i>
          </button>
        )}
      </div>

      {locationError && (
        <LocationError
          getUserLocation={getUserLocation}
          setLocationError={setLocationError}
        />
      )}
      {showTutorial && <Tutorial setShowTutorial={setShowTutorial} />}
    </>
  );
};

export default ProceedContainer;
