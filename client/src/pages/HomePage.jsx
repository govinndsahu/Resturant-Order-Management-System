import React, { useState } from "react";
import Navbar from "../components/Navbar";
import CategoriesContainer from "../components/CategoriesContainer";
import ProductsContainer from "../components/ProductsContainer";
import ProceedContainer from "../components/ProceedContainer";
import OrderForm from "../components/OrderForm";
import AppLayer from "../components/AppLayer";
import { Toaster } from "react-hot-toast";

const HomePage = () => {
  const [displayForm, setDisplayForm] = useState(false);
  const [category, setCategory] = useState("");
  return (
    <>
      <header>
        <Navbar name={"Cafeteria"} />
        <CategoriesContainer setCategory={setCategory} />
      </header>
      <main>
        <ProductsContainer
          showDetails={true}
          showAddButtons={true}
          addBtnClass={"add-to-cart-btn"}
          addBtnContent={"Add"}
          category={category}
        />
      </main>
      <footer>
        <ProceedContainer setDisplayForm={setDisplayForm} />
      </footer>
      <OrderForm dispalyForm={displayForm} setDisplayForm={setDisplayForm} />
      <Toaster />
    </>
  );
};

export default HomePage;
