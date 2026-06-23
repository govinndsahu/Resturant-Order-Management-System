import { useEffect, useState } from "react";
import "./HomePage.css";
import { Toaster } from "react-hot-toast";

import Navbar from "../components/Navbar";
import CategoriesContainer from "../components/CategoriesContainer";
import ProductsContainer from "../components/ProductsContainer";
import ProceedContainer from "../components/ProceedContainer";
import OrderForm from "../components/OrderForm";
import { getAppVersionApi } from "../apis/appVersionApis";

const HomePage = ({ appName }) => {
  const [displayForm, setDisplayForm] = useState(false);
  const [category, setCategory] = useState("");

  const getAppVersion = async () => {
    const { data } = await getAppVersionApi();
    localStorage.setItem("appVersion", JSON.stringify(data?.version));
  };

  useEffect(() => {
    if (!localStorage.getItem("appVersion")) getAppVersion();
  }, []);

  return (
    <>
      <header>
        <Navbar name={"Cafeteria"} appName={appName} />
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
      <OrderForm
        dispalyForm={displayForm}
        setDisplayForm={setDisplayForm}
        appName={appName}
      />
      <Toaster />
    </>
  );
};

export default HomePage;
