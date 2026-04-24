import { A } from "@solidjs/router";

export default function About() {
  return (
    <main class="mx-auto max-w-4xl px-4 py-16">
      <h1 class="ui-heading mb-6 text-center text-4xl font-bold">Tentang SIMAKO</h1>
      <p class="surface-card ui-text p-6 leading-7">
        SIMAKO adalah platform manajemen kost untuk membantu pemilik kost dan penyewa mengelola kamar,
        tagihan, dan komunikasi dalam satu aplikasi terpadu.
      </p>
      <p class="mt-8 text-center">
        <A href="/" class="text-red-400 hover:text-red-300 hover:underline">
          Kembali ke Home
        </A>
      </p>
    </main>
  );
}
