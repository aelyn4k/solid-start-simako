import { useLocation } from "@solidjs/router";
import { createEffect } from "solid-js";
import { getSeoForPath } from "~/lib/seo";

const seoSelector = "[data-simako-seo='true']";

const setMeta = (attribute: "name" | "property", key: string, content: string) => {
  const meta = document.createElement("meta");
  meta.setAttribute(attribute, key);
  meta.setAttribute("content", content);
  meta.setAttribute("data-simako-seo", "true");
  document.head.appendChild(meta);
};

export default function SeoManager() {
  const location = useLocation();

  createEffect(() => {
    const seo = getSeoForPath(location.pathname);
    document.head.querySelectorAll(seoSelector).forEach((node) => node.remove());
    document.title = seo.title;

    const canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    canonical.setAttribute("href", seo.canonical);
    canonical.setAttribute("data-simako-seo", "true");
    document.head.appendChild(canonical);

    setMeta("name", "description", seo.description);
    setMeta("name", "keywords", seo.keywords);
    setMeta("name", "robots", "index, follow");
    setMeta("property", "og:site_name", "SIMAKO");
    setMeta("property", "og:title", seo.title);
    setMeta("property", "og:description", seo.description);
    setMeta("property", "og:type", seo.type);
    setMeta("property", "og:url", seo.canonical);
    setMeta("property", "og:image", seo.image);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", seo.title);
    setMeta("name", "twitter:description", seo.description);
    setMeta("name", "twitter:image", seo.image);

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(seo.jsonLd);
    script.setAttribute("data-simako-seo", "true");
    document.head.appendChild(script);
  });

  return null;
}
