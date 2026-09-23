"use client";

import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

/** Toasts follow the app theme, which only exists on the client after hydration. */
export const Toasts = () => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const root = document.documentElement;
    const read = () =>
      setTheme(root.getAttribute("data-theme") === "light" ? "light" : "dark");
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return (
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      newestOnTop
      closeOnClick
      pauseOnFocusLoss={false}
      theme={theme}
    />
  );
};
