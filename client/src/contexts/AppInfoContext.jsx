import { createContext, useContext, useEffect, useState } from "react";
import { getAppVersionApi } from "../apis/appVersionApis.js";
import { getAppName } from "../utils/util.js";
import { useConfig } from "./ConfigContext.jsx";

const AppInfoContext = createContext(null);

export function AppInfoProvider({ children }) {
  const { backendUrl } = useConfig();
  const [appName, setAppName] = useState(getAppName());

  useEffect(() => {
    let isActive = true;

    const syncAppInfo = async () => {
      try {
        const { data } = await getAppVersionApi(backendUrl);
        if (!isActive) return;

        if (data?.name) {
          setAppName(data.name);
        }

        if (data?.version) {
          localStorage.setItem("appVersion", JSON.stringify(data.version));
        }
      } catch (error) {
        console.log(error);
      }
    };

    syncAppInfo();

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
