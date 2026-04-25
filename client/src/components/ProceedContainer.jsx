import React from "react";
import { useCart } from "../contexts/Cart";

const ProceedContainer = ({ setDisplayForm }) => {
  const [cart] = useCart();

  const getTotalPrice = () => {
    let total = 0;
    cart.forEach((item) => {
      total += parseInt(item.half_price ? item.half_price : item.full_price);
    });
    return total;
  };

  const handleDisplayForm = (e) => {
    setDisplayForm(true);
  };

  return cart?.length ? (
    <div className="proceed-container w-full h-15 lg:h-20 flex justify-between items-center fixed left-0 bottom-0 ">
      <b className="text-[20px] lg:text-4xl">Total Rs.{getTotalPrice()}</b>
      <span
        className="proceed-btn lg:text-2xl"
        onClick={(e) => handleDisplayForm(e)}>
        Proceed
      </span>
    </div>
  ) : (
    <span></span>
  );
};

export default ProceedContainer;
