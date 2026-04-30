import { Suspense, lazy, useEffect } from "react";
import HomePage from "./pages/HomePage.jsx";
import CartPage from "./pages/CartPage.jsx";
import Navbar from "./components/Navbar.jsx";
import Loader from "./components/Loader.jsx";

import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

const Register = lazy(() => import("./pages/Auth/Register.jsx"));
const Login = lazy(() => import("./pages/Auth/Login.jsx"));
const Dashboard = lazy(() => import("./pages/Admin/Dashboard.jsx"));
const Categories = lazy(() => import("./pages/Admin/Categories.jsx"));
const Orders = lazy(() => import("./pages/Admin/Orders.jsx"));
const Histories = lazy(() => import("./pages/Admin/Histories.jsx"));
const Products = lazy(() => import("./pages/Admin/Products.jsx"));
const Users = lazy(() => import("./pages/Admin/Users.jsx"));

const App = () => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((r) => null)
        .catch((err) => {});
    });
  }

  const AdminStylesLoader = () => {
    const location = useLocation();

    useEffect(() => {
      const user = JSON.parse(localStorage?.getItem("user") || "null");
      const isAdminRoute = location.pathname.startsWith("/dashboard");
      const isAdminUser = user?.role === 1 || user?.role === 2;
      const existingLink = document.head.querySelector(
        'link[data-admin-css="true"]',
      );

      if (isAdminRoute && isAdminUser && !existingLink) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = new URL("./App.css", import.meta.url).href;
        link.dataset.adminCss = "true";
        document.head.appendChild(link);
        return () => {
          link.remove();
        };
      }

      if ((!isAdminRoute || !isAdminUser) && existingLink) {
        existingLink.remove();
      }

      return undefined;
    }, [location.pathname]);

    return null;
  };

  return (
    <BrowserRouter>
      <AdminStylesLoader />
      <Navbar name={"Cafeteria"} />
      <Suspense fallback={<Loader />}>
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
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
