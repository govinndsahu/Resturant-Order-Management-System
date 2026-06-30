import { Suspense, lazy, useEffect, useState } from "react";
import HomePage from "./pages/HomePage.jsx";
import CartPage from "./pages/CartPage.jsx";
import Navbar from "./components/Navbar.jsx";
import Loader from "./components/Loader.jsx";

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router";

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
  getAppName,
  getAppRoute,
  openInstallPrompt,
  registerServiceWorker,
} from "./utils/util.js";
import { getAppVersionApi } from "./apis/appVersionApis.js";
import { useConfig } from "./contexts/ConfigContext.jsx";

const App = () => {
  registerServiceWorker();

  const { backendUrl, menuName } = useConfig();

  const [appName, setAppName] = useState(getAppName());

  useEffect(() => {
    let isActive = true;

    const syncAppInfo = async () => {
      try {
        const { data } = await getAppVersionApi(backendUrl);

        if (!isActive) {
          return;
        }

        if (data?.name) {
          setAppName(data.name);
        }

        if (data?.version) {
          localStorage.setItem(
            "appVersion",
            JSON.stringify(data.version) || {},
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

    syncAppInfo();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    return openInstallPrompt();
  }, []);

  useEffect(() => {
    document.title = appName;

    const assetUrl = (path) => new URL(path, window.location.origin).href;

    const appleTitle = document.querySelector(
      'meta[name="apple-mobile-web-app-title"]',
    );

    if (appleTitle) {
      appleTitle.setAttribute("content", appName);
    }

    const manifestLink = document.querySelector('link[rel="manifest"]');

    if (!manifestLink) {
      return undefined;
    }

    const manifest = {
      name: appName,
      short_name: appName.toLowerCase().replace(/\s+/g, "-"),
      start_url: assetUrl("/"),
      display: "standalone",
      background_color: "#222",
      description: "Lets make your order journey smooth and fast.",
      icons: [
        {
          src: assetUrl("/logo.png"),
          sizes: "248x299",
          type: "image/png",
        },
        {
          src: assetUrl("/logo.png"),
          sizes: "248x299",
          type: "image/png",
        },
        {
          src: assetUrl("/logo.png"),
          sizes: "248x299",
          type: "image/png",
        },
        {
          src: assetUrl("/logo.png"),
          sizes: "248x299",
          type: "image/png",
        },
        {
          src: assetUrl("/logo.png"),
          sizes: "248x299",
          type: "image/png",
        },
        {
          src: assetUrl("/logo.png"),
          sizes: "248x299",
          type: "image/png",
        },
        {
          src: assetUrl("/squarelogo.png"),
          sizes: "248x248",
          type: "image/png",
        },
      ],
      screenshots: [
        {
          src: assetUrl("/mobiless.jpg"),
          sizes: "1080x2400",
          type: "image/png",
          form_factor: "narrow",
        },
        {
          src: assetUrl("/windowss.png"),
          sizes: "1920x1080",
          type: "image/png",
          form_factor: "wide",
        },
      ],
    };

    const manifestUrl = URL.createObjectURL(
      new Blob([JSON.stringify(manifest)], {
        type: "application/manifest+json",
      }),
    );

    const previousHref = manifestLink.getAttribute("href");
    manifestLink.setAttribute("href", manifestUrl);

    return () => {
      URL.revokeObjectURL(manifestUrl);
      if (previousHref) {
        manifestLink.setAttribute("href", previousHref);
      }
    };
  }, [appName]);

  const AdminStylesLoader = () => {
    const location = useLocation();
    useEffect(
      () => adminStylesLoaderFunction(location, appName),
      [location.pathname],
    );
    return null;
  };

  return (
    <BrowserRouter>
      <AdminStylesLoader />
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
