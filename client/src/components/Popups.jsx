import { useState } from "react";
import OrderForm from "./OrderForm";
import PhoneOtpFlow from "./PhoneOtpFlow";
import OrderLimitPopup from "./OrderLimitPopup";
import { Toaster } from "react-hot-toast";
import ProceedContainer from "./ProceedContainer";

const Popups = ({ appName }) => {
  const [displayForm, setDisplayForm] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [isOrderLimitPopupOpen, setIsOrderLimitPopupOpen] = useState(false);

  return (
    <div>
      {/* Order Form Modal */}
      <OrderForm
        setIsOpen={setIsOpen}
        dispalyForm={displayForm}
        setDisplayForm={setDisplayForm}
        appName={appName}
        accessToken={accessToken}
        setIsOrderLimitPopupOpen={setIsOrderLimitPopupOpen}
      />

      <PhoneOtpFlow
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        setAccessToken={setAccessToken}
        setIsOpen={setIsOpen}
        setAccesstoken={setAccessToken}
      />

      <OrderLimitPopup
        isOpen={isOrderLimitPopupOpen}
        onClose={() => setIsOrderLimitPopupOpen(false)}
      />

      <Toaster />

      {/* Fixed Footer */}
      <footer className="menu-footer">
        <ProceedContainer setDisplayForm={setDisplayForm} />
      </footer>
    </div>
  );
};

export default Popups;
