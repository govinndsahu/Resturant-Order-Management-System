import { useState } from "react";
import "./HomePage.css";

import CategoriesContainer from "../components/CategoriesContainer";
import ProductsContainer from "../components/ProductsContainer";
import Popups from "../components/Popups";

const HomePage = ({ appName }) => {
  const [category, setCategory] = useState("");

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

      <Popups appName={appName} />
    </div>
  );
};

export default HomePage;
