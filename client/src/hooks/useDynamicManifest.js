import { useEffect } from "react";

export function useDynamicManifest(appName) {
  useEffect(() => {
    document.title = appName;

    const assetUrl = (path) => new URL(path, window.location.origin).href;

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
        { src: assetUrl("/logo.png"), sizes: "248x299", type: "image/png" },
        { src: assetUrl("/logo.png"), sizes: "248x299", type: "image/png" },
        { src: assetUrl("/logo.png"), sizes: "248x299", type: "image/png" },
        { src: assetUrl("/logo.png"), sizes: "248x299", type: "image/png" },
        { src: assetUrl("/logo.png"), sizes: "248x299", type: "image/png" },
        { src: assetUrl("/logo.png"), sizes: "248x299", type: "image/png" },
        {
          src: assetUrl("/squarelogo.png"),
          sizes: "248x248",
          type: "image/png",
        },
      ],
      screenshots: [
        {
          src: assetUrl("/mobiless.jpg"),
          sizes: "1080x2400",
          type: "image/png",
          form_factor: "narrow",
        },
        {
          src: assetUrl("/windowss.png"),
          sizes: "1920x1080",
          type: "image/png",
          form_factor: "wide",
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
  }, [appName]);
}
