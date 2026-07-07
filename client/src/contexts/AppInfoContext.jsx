import { createContext, useContext, useEffect, useState } from "react";
import { getAppVersionApi } from "../apis/appVersionApis.js";
import { getAppId } from "../utils/util.js";
import { useConfig } from "./ConfigContext.jsx";
import { getAppVersionFromDB, saveAppVersion } from "../hooks/useIndexedDB.js";

const AppInfoContext = createContext(null);

export function AppInfoProvider({ children }) {
  const { backendUrl } = useConfig();
  const [appName, setAppName] = useState(getAppId());

  useEffect(() => {
    let isActive = true;

    const syncAppInfo = async () => {
      try {
        const cached = await getAppVersionFromDB();

        if (cached?.version) {
          if (!isActive) return;
        }

        const { data } = await getAppVersionApi(backendUrl);

        if (!isActive) return;

        if (data?.version) {
          await saveAppVersion(data.version);
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
