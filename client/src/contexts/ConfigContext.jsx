import { createContext, useContext, useEffect, useState } from "react";
import { getAppDataApi } from "../apis/apis";

const ConfigContext = createContext(null);

export function ConfigProvider({ appId, children }) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConfig = async () => {
    try {
      const { data } = await getAppDataApi(appId);
      const menuName = data?.menu?.menuName;

      if (menuName) {
        localStorage.setItem("menuDbName", menuName);
      }

      setConfig({
        backendUrl: data.menu.menuBackendUrl,
        menuName,
        menu: data.menu,
        // add other config values here if needed
      });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, [appId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Failed to load config.</div>;

  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
}

export function useConfig() {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error("useConfig must be used inside ConfigProvider");
  return ctx;
}
