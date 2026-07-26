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
  const normalizedPath = path ? (path.startsWith("/") ? path : `/${path}`) : "";

  if (!appRouteSegment) {
    return normalizedPath || "/";
  }

  return `${`/${appRouteSegment}`}${normalizedPath}`;
};

export const getAppId = () => {
  const pathSegment = window.location.pathname.split("/").filter(Boolean)[0];

  if (pathSegment) {
    return pathSegment;
  }

  const envAppId = import.meta.env.VITE_APP_NAME?.trim();

  if (envAppId) {
    return envAppId;
  }

  return "Menu App";
};

export const getAppName = () => getAppId();

export const adminStylesLoaderFunction = (location, appName, menu = null) => {
  const user = JSON.parse(localStorage?.getItem("user") || "null");
  const isAdminRoute = location.pathname.startsWith(
    getAppRoute(appName, "dashboard"),
  );
  const isAdminUser = user?.role === 1 || user?.role === 2;
  const existingLink = document.head.querySelector(
    'link[data-admin-css="true"]',
  );
  const existingFavicon = document.head.querySelector(
    'link[data-admin-favicon="true"]',
  );
  const faviconHref = menu?.menuLogoImg
    ? `data:image/png;base64,${menu.menuLogoImg}`
    : "";

  if (isAdminRoute && isAdminUser && !existingLink) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = new URL("../App.css", import.meta.url).href;
    link.dataset.adminCss = "true";
    document.head.appendChild(link);

    if (faviconHref) {
      if (existingFavicon) {
        existingFavicon.href = faviconHref;
      } else {
        const favicon = document.createElement("link");
        favicon.rel = "icon";
        favicon.type = "image/png";
        favicon.href = faviconHref;
        favicon.dataset.adminFavicon = "true";
        document.head.appendChild(favicon);
      }
    }

    return () => {
      link.remove();
      document.head.querySelector('link[data-admin-favicon="true"]')?.remove();
    };
  }

  if ((!isAdminRoute || !isAdminUser) && existingLink) {
    existingLink.remove();
  }

  if ((!isAdminRoute || !isAdminUser) && existingFavicon) {
    existingFavicon.remove();
  }

  return undefined;
};

let isServiceWorkerRegistrationStarted = false;

export const registerServiceWorker = () => {
  if (isServiceWorkerRegistrationStarted || !("serviceWorker" in navigator)) {
    return;
  }

  isServiceWorkerRegistrationStarted = true;

  const baseUrl = import.meta.env.BASE_URL || "/";
  const serviceWorkerUrl = `${baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`}sw.js`;

  const register = () => {
    navigator.serviceWorker.register(serviceWorkerUrl).catch(() => {
      isServiceWorkerRegistrationStarted = false;
    });
  };

  if (document.readyState === "complete" || document.readyState === "interactive") {
    register();
    return;
  }

  window.addEventListener("load", register, { once: true });
};
