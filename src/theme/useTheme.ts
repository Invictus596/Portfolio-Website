import { useCallback, useEffect, useState } from "react";
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

  const meta = THEMES.find((entry) => entry.id === theme);
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (meta && themeColor) {
    themeColor.setAttribute("content", meta.bg);
  }
}

/**
 * Theme state + persistence.
 *
 * The first paint is handled by the inline script in `index.html`, so this
 * hook only has to keep `<html data-theme>` and localStorage in agreement
 * afterwards. It never runs during SSR — `readStoredTheme` guards on window.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<ThemeId>(readStoredTheme);

  useEffect(() => {
    syncTheme(theme);
  }, [theme]);

  const setTheme = useCallback((next: ThemeId) => {
    setThemeState(next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Persistence is best-effort; the in-memory theme still applies.
    }
  }, []);

  return { theme, setTheme };
}
