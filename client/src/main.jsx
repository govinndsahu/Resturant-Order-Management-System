import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CartProvider } from "./contexts/Cart.jsx";

import "./index.css";
import "remixicon/fonts/remixicon.css";

import App from "./App.jsx";
import { getAppName } from "./utils/util.js";
import { ConfigProvider } from "./contexts/ConfigContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ConfigProvider appName={getAppName()}>
      <CartProvider>
        <App />
      </CartProvider>
    </ConfigProvider>
  </StrictMode>,
);
