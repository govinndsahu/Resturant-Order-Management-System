import HomePage from "./pages/HomePage.jsx";
import CartPage from "./pages/CartPage.jsx";
import Register from "./pages/Auth/Register.jsx";
import Login from "./pages/Auth/Login.jsx";
import Dashboard from "./pages/Admin/Dashboard.jsx";
import Navbar from "./components/Navbar.jsx";
import Categories from "./pages/Admin/Categories.jsx";
import Orders from "./pages/Admin/Orders.jsx";
import Histories from "./pages/Admin/Histories.jsx";
import Products from "./pages/Admin/Products.jsx";
import Users from "./pages/Admin/Users.jsx";

import { BrowserRouter, Route, Routes } from "react-router-dom";

const App = () => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((r) => null)
        .catch((err) => {});
    });
  }
  return (
    <BrowserRouter>
      <Navbar name={"Cafeteria"} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cartpage" element={<CartPage />} />
        <Route path="/registerpage" element={<Register />} />
        <Route path="/loginpage" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/categories" element={<Categories />} />
        <Route path="/dashboard/products" element={<Products />} />
        <Route path="/dashboard/orders" element={<Orders />} />
        <Route path="/dashboard/orders-histories" element={<Histories />} />
        <Route path="/dashboard/users" element={<Users />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
