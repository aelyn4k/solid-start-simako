import { A } from "@solidjs/router";
import { Frown, Home } from "lucide-solid";

export default function NotFound() {
  return (
    <main class="layout-shell flex min-h-[68vh] items-center justify-center py-20">
      <section class="mx-auto flex max-w-xl flex-col items-center text-center">
        <div class="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20 text-red-500">
          <Frown size={34} />
        </div>
        <p class="text-6xl font-extrabold leading-none text-red-500 md:text-7xl">
          404
        </p>
        <h1 class="ui-heading mt-4 text-3xl font-bold md:text-4xl">
          Halaman Tidak Ditemukan
        </h1>
        <p class="ui-muted mt-4 text-base">
          Halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <A
          href="/"
          class="mt-8 inline-flex items-center rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
        >
          <Home class="mr-2" size={16} />
          Kembali ke Beranda
        </A>
      </section>
    </main>
  );
}
