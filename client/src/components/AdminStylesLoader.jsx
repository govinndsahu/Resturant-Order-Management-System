import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const AdminStylesLoader = () => {
  const location = useLocation();

  useEffect(() => {
    const user = JSON.parse(localStorage?.getItem("user") || "null");
    const isAdminRoute = location.pathname.startsWith("/dashboard");
    const isAdminUser = user?.role === 1 || user?.role === 2;
    const existingLink = document.head.querySelector(
      'link[data-admin-css="true"]',
    );

    if (isAdminRoute && isAdminUser && !existingLink) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = new URL("./App.css", import.meta.url).href;
      link.dataset.adminCss = "true";
      document.head.appendChild(link);
      return () => {
        link.remove();
      };
    }

    if ((!isAdminRoute || !isAdminUser) && existingLink) {
      existingLink.remove();
    }

    return undefined;
  }, [location.pathname]);

  return null;
};
