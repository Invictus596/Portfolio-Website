/**
 * Theme manifest.
 *
 * The palettes themselves live in `themes.css` as `[data-theme="<id>"]`
 * blocks — this module only carries what the UI needs to *render* the picker
 * (label, preview swatches, page background for the browser theme-color).
 * Keeping the colour table in CSS means switching themes is a single
 * attribute write: no re-render, no inline style churn, no hydration gap.
 */

export type ThemeId =
  | "amoled"
  | "catppuccin"
  | "nord"
  | "dracula"
  | "gruvbox"
  | "tokyonight"
  | "onedark"
  | "solarized"
  | "rosepine"
  | "everforest"
  | "gamer";

export type ThemeMeta = {
  id: ThemeId;
  label: string;
  /** Page background — also drives <meta name="theme-color">. */
  bg: string;
  /** Three dots shown in the trigger and the option rows. */
  swatches: [string, string, string];
  /** Hidden from the picker until the terminal easter egg is solved. */
  locked?: boolean;
};

export const THEMES: readonly ThemeMeta[] = [
  {
    id: "amoled",
    label: "Amoled Blue",
    bg: "#000000",
    swatches: ["#8ab4f8", "#000000", "#d0bcff"],
  },
  {
    id: "catppuccin",
    label: "Catppuccin Mocha",
    bg: "#1e1e2e",
    swatches: ["#89b4fa", "#1e1e2e", "#cba6f7"],
  },
  {
    id: "nord",
    label: "Nord",
    bg: "#2e3440",
    swatches: ["#88c0d0", "#2e3440", "#b48ead"],
  },
  {
    id: "dracula",
    label: "Dracula",
    bg: "#282a36",
    swatches: ["#bd93f9", "#282a36", "#ff79c6"],
  },
  {
    id: "gruvbox",
    label: "Gruvbox Dark",
    bg: "#282828",
    swatches: ["#83a598", "#282828", "#fabd2f"],
  },
  {
    id: "tokyonight",
    label: "Tokyo Night",
    bg: "#1a1b26",
    swatches: ["#7aa2f7", "#1a1b26", "#bb9af7"],
  },
  {
    id: "onedark",
    label: "One Dark Pro",
    bg: "#282c34",
    swatches: ["#61afef", "#282c34", "#c678dd"],
  },
  {
    id: "solarized",
    label: "Solarized Dark",
    bg: "#002b36",
    swatches: ["#2aa198", "#002b36", "#6c71c4"],
  },
  {
    id: "rosepine",
    label: "Rosé Pine",
    bg: "#191724",
    swatches: ["#c4a7e7", "#191724", "#9ccfd8"],
  },
  {
    id: "everforest",
    label: "Everforest",
    bg: "#2d353b",
    swatches: ["#a7c080", "#2d353b", "#d699b6"],
  },
  {
    id: "gamer",
    label: "Gamer RGB (Unlocked)",
    bg: "#000000",
    swatches: ["#ff004c", "#00ff9d", "#00c2ff"],
    locked: true,
  },
] as const;

/**
 * The picker list. The gamer palette is hidden until the terminal login has
 * been solved at least once, so the 11th theme stays an actual secret.
 */
export function visibleThemes(gamerUnlocked: boolean): readonly ThemeMeta[] {
  return gamerUnlocked
    ? THEMES
    : THEMES.filter((theme) => !theme.locked);
}

export const DEFAULT_THEME: ThemeId = "amoled";

/** Must match the inline pre-paint script in `index.html`. */
export const THEME_STORAGE_KEY = "portfolio-theme";

export function isThemeId(value: string | null): value is ThemeId {
  return THEMES.some((theme) => theme.id === value);
}
