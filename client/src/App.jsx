// src/App.jsx
import { Suspense, lazy, useEffect } from "react";
import HomePage from "./pages/HomePage.jsx";
import CartPage from "./pages/CartPage.jsx";
import Navbar from "./components/Navbar.jsx";
import Loader from "./components/Loader.jsx";

import { BrowserRouter, Route, Routes, useLocation } from "react-router";

const Register = lazy(() => import("./pages/Auth/Register.jsx"));
const Login = lazy(() => import("./pages/Auth/Login.jsx"));
const Dashboard = lazy(() => import("./pages/Admin/Dashboard.jsx"));
const Categories = lazy(() => import("./pages/Admin/Categories.jsx"));
const Orders = lazy(() => import("./pages/Admin/Orders.jsx"));
const Histories = lazy(() => import("./pages/Admin/Histories.jsx"));
const Products = lazy(() => import("./pages/Admin/Products.jsx"));
const Users = lazy(() => import("./pages/Admin/Users.jsx"));

import {
  adminStylesLoaderFunction,
  getAppRoute,
  registerServiceWorker,
} from "./utils/util.js";
import { useConfig } from "./contexts/ConfigContext.jsx";
import { useAppInfo } from "./contexts/AppInfoContext.jsx";
import { useInstallPrompt } from "./hooks/useInstallPrompt.js";
import { useDynamicManifest } from "./hooks/useDynamicManifest.js";

const AdminStylesLoader = ({ appName }) => {
  const location = useLocation();
  useEffect(
    () => adminStylesLoaderFunction(location, appName),
    [location.pathname],
  );
  return null;
};

const App = () => {
  registerServiceWorker();

  const { menuName } = useConfig();
  const { appName } = useAppInfo();

  useInstallPrompt();
  useDynamicManifest(appName);

  return (
    <BrowserRouter>
      <AdminStylesLoader appName={appName} />
      <Navbar name={menuName} appName={appName} />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route
            path={getAppRoute(appName)}
            element={<HomePage appName={appName} />}
          />
          <Route
            path={getAppRoute(appName, "cartpage")}
            element={<CartPage appName={appName} />}
          />
          <Route
            path={getAppRoute(appName, "registerpage")}
            element={<Register appName={appName} />}
          />
          <Route
            path={getAppRoute(appName, "loginpage")}
            element={<Login appName={appName} />}
          />
          <Route
            path={getAppRoute(appName, "dashboard")}
            element={<Dashboard appName={appName} />}
          />
          <Route
            path={getAppRoute(appName, "dashboard/categories")}
            element={<Categories />}
          />
          <Route
            path={getAppRoute(appName, "dashboard/products")}
            element={<Products />}
          />
          <Route
            path={getAppRoute(appName, "dashboard/orders")}
            element={<Orders />}
          />
          <Route
            path={getAppRoute(appName, "dashboard/orders-histories")}
            element={<Histories />}
          />
          <Route
            path={getAppRoute(appName, "dashboard/users")}
            element={<Users />}
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
