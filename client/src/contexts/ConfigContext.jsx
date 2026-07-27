import { createContext, useContext, useEffect, useState } from "react";
import { getAppDataApi } from "../apis/apis";
import { getLocationValidationConfigApi } from "../apis/configurationApis";

const ConfigContext = createContext(null);

export function ConfigProvider({ appId, children }) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConfig = async () => {
    try {
      const { data } = await getAppDataApi(appId);

      if (data.success) {
        const menuName = data?.menu?.menuName;
        if (menuName) {
          localStorage.setItem("menuDbName", menuName);
        }

        const isLocationNeed = await isLocationRequired(
          data.menu.menuBackendUrl,
        );

        setConfig({
          menuName,
          backendUrl: data.menu.menuBackendUrl,
          menu: data.menu,
          isLocationNeed: isLocationNeed.doValidate,
          user: isLocationNeed.user,
          setError,
        });
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const isLocationRequired = async (backendUrl) => {
    try {
      const { data } = await getLocationValidationConfigApi(backendUrl);

      if (data.success) {
        return { user: data.user, doValidate: data.config.doValidate };
      } else {
        return { user: null, doValidate: false };
      }
    } catch (error) {
      setError(error);
      return { user: null, doValidate: false };
    }
  };

  useEffect(() => {
    fetchConfig();
  }, [appId]);

  if (loading)
    return (
      <div
        id="config-loader"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "1.5rem",
          fontWeight: "bold",
        }}>
        Loading...
      </div>
    );
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
