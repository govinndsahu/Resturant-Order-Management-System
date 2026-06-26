export const openInstallPrompt = () => {
  const handleBeforeInstallPrompt = (event) => {
    event.preventDefault();
    window.deferredPrompt = event;
  };

  const handleAppInstalled = () => {
    window.deferredPrompt = null;
  };

  window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  window.addEventListener("appinstalled", handleAppInstalled);

  return () => {
    window.removeEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt,
    );
    window.removeEventListener("appinstalled", handleAppInstalled);
  };
};

export const getAppRoute = (appName, path = "") => {
  const appRouteSegment = `${appName || ""}`
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
  const normalizedPath = path
    ? path.startsWith("/")
      ? path
      : `/${path}`
    : "";

  if (!appRouteSegment) {
    return normalizedPath || "/";
  }

  return `${`/${appRouteSegment}`}${normalizedPath}`;
};

export const getAppName = () => {
  const envAppName = import.meta.env.VITE_APP_NAME?.trim();

  if (envAppName) {
    return envAppName;
  }

  const pathSegment = window.location.pathname.split("/").filter(Boolean)[0];

  if (!pathSegment) {
    return "Menu App";
  }

  return `${pathSegment.charAt(0).toUpperCase()}${pathSegment.slice(1)}`;
};

export const getAppSlug = () => {
  const envAppName = import.meta.env.VITE_APP_NAME?.trim();

  if (envAppName) {
    return envAppName.toLowerCase().replace(/\s+/g, "-");
  }

  const pathSegment = window.location.pathname.split("/").filter(Boolean)[0];

  if (!pathSegment) {
    return "menu-app";
  }

  return pathSegment.toLowerCase();
};

export const adminStylesLoaderFunction = (location, appName) => {
  const user = JSON.parse(localStorage?.getItem("user") || "null");
  const isAdminRoute = location.pathname.startsWith(
    getAppRoute(appName, "dashboard"),
  );
  const isAdminUser = user?.role === 1 || user?.role === 2;
  const existingLink = document.head.querySelector(
    'link[data-admin-css="true"]',
  );

  if (isAdminRoute && isAdminUser && !existingLink) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = new URL("../App.css", import.meta.url).href;
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
};

export const registerServiceWorker = () => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((r) => null)
        .catch((err) => { });
    });
  }
};
