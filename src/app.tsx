import { Router, useLocation } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import type { JSX } from "solid-js";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import SeoManager from "~/components/SeoManager";
import "./app.css";

function AppFrame(props: { children: JSX.Element }) {
  const location = useLocation();
  const isDashboard = () => location.pathname.startsWith("/dashboard");

  return (
    <div class="app-shell min-h-screen flex flex-col">
      <SeoManager />
      {!isDashboard() && <Header />}
      <main class="flex-grow">
        <Suspense>{props.children}</Suspense>
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
