"use client";

import { useSyncExternalStore } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

type Theme = "light" | "dark";

const storageKey = "red-color-theme";

function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "#131315" : "#fdfcfb");
  window.dispatchEvent(new Event("red-theme-change"));
}

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribeToTheme(callback: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const followSystem = () => {
    if (window.localStorage.getItem(storageKey)) return;
    applyTheme(systemTheme());
  };
  media.addEventListener("change", followSystem);
  window.addEventListener("red-theme-change", callback);
  return () => {
    media.removeEventListener("change", followSystem);
    window.removeEventListener("red-theme-change", callback);
  };
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeToTheme, currentTheme, () => "light");

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    window.localStorage.setItem(storageKey, next);
    applyTheme(next);
  }

  return <button
    className="theme-toggle"
    type="button"
    onClick={toggleTheme}
    aria-label={`Use ${theme === "dark" ? "light" : "dark"} color theme`}
  >
    {theme === "dark"
      ? <FiMoon className="button-icon theme-icon" aria-hidden="true" />
      : <FiSun className="button-icon theme-icon" aria-hidden="true" />}
    {theme === "dark" ? "Dark" : "Light"}
  </button>;
}
