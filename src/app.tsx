import { Router, useLocation } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import type { JSX } from "solid-js";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import PageLoading from "~/components/PageLoading";
import SeoManager from "~/components/SeoManager";
import "./app.css";

function AppFrame(props: { children: JSX.Element }) {
  const location = useLocation();
  const isDashboard = () => location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/admin");

  return (
    <div class="app-shell min-h-screen flex flex-col">
      <SeoManager />
      <PageLoading />
      {!isDashboard() && <Header />}
      <main class="flex-grow">
        <Suspense fallback={<div class="route-loading-space" />}>{props.children}</Suspense>
      </main>
      {!isDashboard() && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router
      root={(props) => <AppFrame>{props.children}</AppFrame>}
    >
      <FileRoutes />
    </Router>
  );
}
