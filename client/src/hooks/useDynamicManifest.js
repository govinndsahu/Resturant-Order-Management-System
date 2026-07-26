import { useEffect } from "react";

const toImageSrc = (value) => {
  if (!value || typeof value !== "string") {
    return "";
  }

  if (
    value.startsWith("data:image/") ||
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("/")
  ) {
    return value;
  }

  return `data:image/png;base64,${value}`;
};

export function useDynamicManifest(appName, menu = null) {
  useEffect(() => {
    document.title = appName;

    const assetUrl = (path) => new URL(path, window.location.origin).href;
    const dynamicLogo = toImageSrc(menu?.menuLogoImg) || assetUrl("/logo.png");
    const dynamicSquareLogo =
      toImageSrc(menu?.menuLogoImg) ||
      toImageSrc(menu?.menuLogoImg) ||
      assetUrl("/squarelogo.png");

    const dynamicScreenshots = Array.isArray(menu?.menuLogoImg)
      ? menu.menuLogoImg
          .map((screenshot) => {
            if (!screenshot?.src) {
              return null;
            }

            return {
              src: toImageSrc(screenshot.src),
              sizes: screenshot.sizes,
              type: screenshot.type || "image/png",
              form_factor: screenshot.form_factor,
            };
          })
          .filter(Boolean)
      : [];

    const appleTitle = document.querySelector(
      'meta[name="apple-mobile-web-app-title"]',
    );
    if (appleTitle) {
      appleTitle.setAttribute("content", appName);
    }

    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (!manifestLink) return undefined;

    const manifest = {
      name: appName,
      short_name: appName.toLowerCase().replace(/\s+/g, "-"),
      start_url: assetUrl("/"),
      display: "standalone",
      background_color: "#222",
      description: "Lets make your order journey smooth and fast.",
      icons: [
        { src: dynamicLogo, sizes: "248x299", type: "image/png" },
        { src: dynamicLogo, sizes: "248x299", type: "image/png" },
        { src: dynamicLogo, sizes: "248x299", type: "image/png" },
        { src: dynamicLogo, sizes: "248x299", type: "image/png" },
        { src: dynamicLogo, sizes: "248x299", type: "image/png" },
        { src: dynamicLogo, sizes: "248x299", type: "image/png" },
        {
          src: dynamicSquareLogo,
          sizes: "248x248",
          type: "image/png",
        },
      ],
    };

    const manifestUrl = URL.createObjectURL(
      new Blob([JSON.stringify(manifest)], {
        type: "application/manifest+json",
      }),
    );

    const previousHref = manifestLink.getAttribute("href");
    manifestLink.setAttribute("href", manifestUrl);

    return () => {
      URL.revokeObjectURL(manifestUrl);
      if (previousHref) {
        manifestLink.setAttribute("href", previousHref);
      }
    };
  }, [appName, menu]);
}
