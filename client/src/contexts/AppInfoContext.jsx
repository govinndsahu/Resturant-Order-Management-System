import { createContext, useContext, useEffect, useState } from "react";
import { getAppId } from "../utils/util.js";
import { useConfig } from "./ConfigContext.jsx";
import { getAppVersionFromDB, saveAppVersion } from "../hooks/useIndexedDB.js";

const AppInfoContext = createContext(null);

export function AppInfoProvider({ children }) {
  const { backendUrl, menu } = useConfig();
  const [appName, setAppName] = useState(getAppId());

  useEffect(() => {
    let isActive = true;

    return () => {
      isActive = false;
    };
  }, [backendUrl]);

  return (
    <AppInfoContext.Provider value={{ appName, setAppName }}>
      {children}
    </AppInfoContext.Provider>
  );
}

export function useAppInfo() {
  const ctx = useContext(AppInfoContext);
  if (!ctx) throw new Error("useAppInfo must be used inside AppInfoProvider");
  return ctx;
}
