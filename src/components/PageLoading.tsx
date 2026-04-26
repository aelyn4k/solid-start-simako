import { useLocation } from "@solidjs/router";
import { createEffect, createSignal, onCleanup, onMount } from "solid-js";

const loadingDuration = 760;

const isPlainInternalNavigation = (event: MouseEvent, anchor: HTMLAnchorElement) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return false;
  }

  if (anchor.target && anchor.target !== "_self") {
    return false;
  }

  const url = new URL(anchor.href, window.location.href);
  const currentUrl = new URL(window.location.href);

  return url.origin === currentUrl.origin && `${url.pathname}${url.search}` !== `${currentUrl.pathname}${currentUrl.search}`;
};

export default function PageLoading() {
  const location = useLocation();
  const [loading, setLoading] = createSignal(false);
  let timer: ReturnType<typeof window.setTimeout> | undefined;

  const finishLoading = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => setLoading(false), loadingDuration);
  };

  const startLoading = () => {
    window.clearTimeout(timer);
    setLoading(true);
  };

  onMount(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const anchor = target?.closest("a[href]");

      if (anchor instanceof HTMLAnchorElement && isPlainInternalNavigation(event, anchor)) {
        startLoading();
      }
    };

    document.addEventListener("click", handleClick, true);
    onCleanup(() => {
      document.removeEventListener("click", handleClick, true);
      window.clearTimeout(timer);
    });
  });

  createEffect(() => {
    location.pathname;
    location.search;
    finishLoading();
  });

  return (
    <div class={`page-loading ${loading() ? "page-loading-active" : ""}`} aria-hidden="true">
      <div class="page-loading-bar" />
    </div>
  );
}
