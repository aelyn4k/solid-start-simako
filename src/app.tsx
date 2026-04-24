import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import "./app.css";

export default function App() {
  return (
    <Router
      root={(props) => (
        <div class="min-h-screen flex flex-col text-slate-100">
          <Header />
          <main class="flex-grow">
            <Suspense>{props.children}</Suspense>
          </main>
          <Footer />
        </div>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
