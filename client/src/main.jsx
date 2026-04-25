import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./App.css";
import "remixicon/fonts/remixicon.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CartPage from "./pages/CartPage.jsx";
import { CartProvider } from "./contexts/Cart.jsx";
import Register from "./pages/Auth/Register.jsx";
import Login from "./pages/Auth/Login.jsx";
import Dashboard from "./pages/Admin/Dashboard.jsx";
import Navbar from "./components/Navbar.jsx";
import Categories from "./pages/Admin/Categories.jsx";
import Orders from "./pages/Admin/Orders.jsx";
import Histories from "./pages/Admin/Histories.jsx";
import Products from "./pages/Admin/Products.jsx";
import Users from "./pages/Admin/Users.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CartProvider>
      <BrowserRouter>
        <Navbar name={"Cafeteria"} />
        <Routes>
          <Route path="/" element={<App />} />
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
    </CartProvider>
  </StrictMode>
);
