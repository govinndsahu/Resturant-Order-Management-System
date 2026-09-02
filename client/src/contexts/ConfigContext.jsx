import { createContext, useContext, useEffect, useState } from "react";
import { getAppDataApi } from "../apis/apis";
import { getConfigurationApi } from "../apis/configurationApis";

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

        const { configurations } = await getConfiguration(
          data.menu.menuBackendUrl,
        );

        setConfig({
          menuName,
          backendUrl: data.menu.menuBackendUrl,
          menu: data.menu,
          configurations,
          setError,
        });
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getConfiguration = async (backendUrl) => {
    try {
      const { data } = await getConfigurationApi(backendUrl);

      if (data.success) {
        return { configurations: data.config };
      } else {
        return {
          configurations: {
            customerNameValidation: { doValidate: false },
            locationValidation: { doValidate: false },
            customerPhoneValidation: { doValidate: false },
            phoneOtpValidation: { doValidate: false },
          },
        };
      }
    } catch (error) {
      setError(error);
      return {
        configurations: {
          customerNameValidation: { doValidate: false },
          locationValidation: { doValidate: false },
          customerPhoneValidation: { doValidate: false },
          phoneOtpValidation: { doValidate: false },
        },
      };
    }
  };

  useEffect(() => {
    fetchConfig();
  }, [appId]);

  if (loading) return <span className="app-loader"></span>;
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
