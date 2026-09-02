import { useState } from "react";
import "./HomePage.css";
import { Toaster } from "react-hot-toast";

import CategoriesContainer from "../components/CategoriesContainer";
import ProductsContainer from "../components/ProductsContainer";
import ProceedContainer from "../components/ProceedContainer";
import OrderForm from "../components/OrderForm";
import PhoneOtpFlow from "../components/PhoneOtpFlow";

const HomePage = ({ appName }) => {
  const [displayForm, setDisplayForm] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [accessToken, setAccessToken] = useState("");

  return (
    <div className="menu-page">
      {/* Fixed Header */}
      <header className="menu-header">
        <CategoriesContainer setCategory={setCategory} />
      </header>

      {/* Main Content */}
      <main className="menu-main">
        <ProductsContainer
          showDetails={true}
          showAddButtons={true}
          addBtnClass={"add-to-cart-btn"}
          addBtnContent={"Add"}
          category={category}
        />
      </main>

      {/* Fixed Footer */}
      <footer className="menu-footer">
        <ProceedContainer setDisplayForm={setDisplayForm} />
      </footer>

      {/* Order Form Modal */}
      <OrderForm
        setIsOpen={setIsOpen}
        dispalyForm={displayForm}
        setDisplayForm={setDisplayForm}
        appName={appName}
        accessToken={accessToken}
      />

      <PhoneOtpFlow
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        setAccessToken={setAccessToken}
        setIsOpen={setIsOpen}
        setAccesstoken={setAccessToken}
      />

      <Toaster />
    </div>
  );
};

export default HomePage;
