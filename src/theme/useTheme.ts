import { useEffect, useSyncExternalStore } from "react";
import {
  DEFAULT_THEME,
  THEMES,
  THEME_STORAGE_KEY,
  isThemeId,
  type ThemeId,
} from "./themes";

function readStoredTheme(): ThemeId {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemeId(stored)) return stored;
  } catch {
    // Private mode / blocked storage — fall through to the default.
  }
  return DEFAULT_THEME;
}

/** Applies the theme to <html> and keeps the browser chrome in sync. */
function syncTheme(theme: ThemeId) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);

  // The RGB accents are opt-in via a class, so the other ten palettes stay
  // pure token swaps. Mirrored in the pre-paint script in index.html.
  root.classList.toggle("theme-gamer", theme === "gamer");

  const meta = THEMES.find((entry) => entry.id === theme);
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (meta && themeColor) {
    themeColor.setAttribute("content", meta.bg);
  }
}

/**
 * Shared theme store.
 *
 * A module-level store rather than component state: the switcher and the
 * terminal (which grants the gamer palette on login) must observe the same
 * value. `useSyncExternalStore` keeps both in sync without a provider.
 *
 * The first paint is handled by the inline script in `index.html`; this store
 * takes over afterwards and re-asserts the theme on mount.
 */
let current: ThemeId | null = null;
const listeners = new Set<() => void>();

function getSnapshot(): ThemeId {
  if (current === null) current = readStoredTheme();
  return current;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function setTheme(next: ThemeId) {
  current = next;
  syncTheme(next);

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // Persistence is best-effort; the in-memory theme still applies.
  }

  listeners.forEach((listener) => listener());
}

export function useTheme() {
  const theme = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => DEFAULT_THEME,
  );

  useEffect(() => {
    syncTheme(theme);
  }, [theme]);

  return { theme, setTheme };
}
