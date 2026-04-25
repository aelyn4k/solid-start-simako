// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";
import { getRequestEvent } from "solid-js/web";
import { getSeoForPath } from "~/lib/seo";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => {
      const requestEvent = getRequestEvent();
      const pathname = requestEvent ? new URL(requestEvent.request.url).pathname : "/";
      const seo = getSeoForPath(pathname);

      return (
        <html lang="id">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>{seo.title}</title>
            <meta name="description" content={seo.description} data-simako-seo="true" />
            <meta name="keywords" content={seo.keywords} data-simako-seo="true" />
            <meta name="robots" content="index, follow" data-simako-seo="true" />
            <link rel="canonical" href={seo.canonical} data-simako-seo="true" />
            <meta property="og:site_name" content="SIMAKO" data-simako-seo="true" />
            <meta property="og:title" content={seo.title} data-simako-seo="true" />
            <meta property="og:description" content={seo.description} data-simako-seo="true" />
            <meta property="og:type" content={seo.type} data-simako-seo="true" />
            <meta property="og:url" content={seo.canonical} data-simako-seo="true" />
            <meta property="og:image" content={seo.image} data-simako-seo="true" />
            <meta name="twitter:card" content="summary_large_image" data-simako-seo="true" />
            <meta name="twitter:title" content={seo.title} data-simako-seo="true" />
            <meta name="twitter:description" content={seo.description} data-simako-seo="true" />
            <meta name="twitter:image" content={seo.image} data-simako-seo="true" />
            <script type="application/ld+json" data-simako-seo="true">
              {JSON.stringify(seo.jsonLd)}
            </script>
            <link rel="icon" href="/favicon.ico" />
            <script>
              {`(() => {
                try {
                  const savedTheme = localStorage.getItem("simako-theme");
                  const theme = savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark";
                  document.documentElement.dataset.theme = theme;
                } catch {
                  document.documentElement.dataset.theme = "dark";
                }
              })();`}
            </script>
            {assets}
          </head>
          <body>
            <div id="app">{children}</div>
            {scripts}
          </body>
        </html>
      );
    }}
  />
));
