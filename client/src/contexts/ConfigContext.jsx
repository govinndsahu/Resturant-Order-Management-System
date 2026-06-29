import { createContext, useContext, useEffect, useState } from "react";
import { getAppDataApi } from "../apis/apis";

const ConfigContext = createContext(null);

export function ConfigProvider({ appName, children }) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data } = await getAppDataApi(appName);
        setConfig({
          backendUrl: data.menu.menuBackendUrl,
          // add other config values here if needed
        });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [appName]);

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
