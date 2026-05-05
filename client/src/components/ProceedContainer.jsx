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

  const handleDisplayForm = async (e) => {
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

  return cart?.length ? (
    <>
      <div className="proceed-container w-full h-15 lg:h-20 flex justify-between items-center fixed left-0 bottom-0 ">
        <b className="text-[20px] lg:text-4xl">Total Rs.{getTotalPrice()}</b>

        {loader ? (
          <div>
            <span className="proceed-loader"></span>
          </div>
        ) : (
          <span
            className="proceed-btn lg:text-2xl"
            onClick={(e) => handleDisplayForm(e)}>
            Proceed
          </span>
        )}
      </div>
      {locationError ? (
        <LocationError
          getUserLocation={getUserLocation}
          setLocationError={setLocationError}
        />
      ) : null}
      {showTutorial ? <Tutorial setShowTutorial={setShowTutorial} /> : null}
    </>
  ) : null;
};

export default ProceedContainer;
