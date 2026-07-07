import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CartProvider } from "./contexts/Cart.jsx";

import "./index.css";
import "remixicon/fonts/remixicon.css";

import App from "./App.jsx";
import { getAppId } from "./utils/util.js";
import { ConfigProvider } from "./contexts/ConfigContext.jsx";
import { AppInfoProvider } from "./contexts/AppInfoContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ConfigProvider appId={getAppId()}>
      <AppInfoProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AppInfoProvider>
    </ConfigProvider>
  </StrictMode>,
);
