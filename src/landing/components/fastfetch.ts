import {
  DEFAULT_THEME,
  THEMES,
  THEME_STORAGE_KEY,
  isThemeId,
  type ThemeId,
} from "../../theme/themes";

export type SpecRow = {
  icon: string;
  label: string;
  value: string;
  /** Tailwind text colour for the icon + key, matching the fastfetch keyColor. */
  color: string;
};

/** Compact stylised "V" — leaves room for the spec list at narrow widths. */
export const VENOM_LOGO = [
  "██╗   ██╗",
  "██║   ██║",
  "██║   ██║",
  "╚██╗ ██╔╝",
  " ╚████╔╝",
  "  ╚══╝",
].join("\n");

/** Standard terminal palette, in ANSI order. */
export const PALETTE = [
  "bg-red-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-blue-500",
  "bg-fuchsia-500",
  "bg-cyan-500",
  "bg-white",
];

/**
 * The fastfetch body. `theme` is the human label of the active palette and
 * `uptime` is already formatted — both are resolved at command time so the
 * output reflects the site as it is right now.
 */
export function specRows(theme: string, uptime: string): SpecRow[] {
  return [
    {
      icon: "\uF31A",
      label: "OS",
      value: "Arch Linux x86_64",
      color: "text-fuchsia-500",
    },
    {
      icon: "\uF17C",
      label: "Kernel",
      value: "Linux 6.10-arch1-1",
      color: "text-green-500",
    },
    {
      icon: "\u{F03D6}",
      label: "Packages",
      value: "1250 (pacman)",
      color: "text-yellow-500",
    },
    {
      icon: "\u{F09E8}",
      label: "DE",
      value: "Hyprland",
      color: "text-blue-500",
    },
    {
      icon: "\u{F10AC}",
      label: "WM",
      value: "Hyprland",
      color: "text-fuchsia-500",
    },
    {
      icon: "\u{F0348}",
      label: "LM",
      value: "SDDM",
      color: "text-cyan-500",
    },
    {
      icon: "\u{F027C}",
      label: "Theme",
      value: theme,
      color: "text-yellow-400",
    },
    {
      icon: "\uF489",
      label: "Terminal",
      value: "kitty",
      color: "text-green-400",
    },
    {
      icon: "\uF031",
      label: "Terminal Font",
      value: "JetBrainsMono Nerd Font",
      color: "text-blue-400",
    },
    {
      icon: "\uF489",
      label: "Shell",
      value: "fish",
      color: "text-fuchsia-500",
    },
    {
      icon: "\u{F0322}",
      label: "Host",
      value: "Lenovo LOQ 15IAX9",
      color: "text-blue-500",
    },
    {
      icon: "\uF4BC",
      label: "CPU",
      value: "Intel Core i5-12450HX (12) @ 4.40GHz",
      color: "text-green-500",
    },
    {
      icon: "\u{F08AE}",
      label: "GPU",
      value: "NVIDIA GeForce RTX 3050 6GB Laptop GPU",
      color: "text-fuchsia-500",
    },
    {
      icon: "\u{F0379}",
      label: "Display",
      value: "1920x1080 @ 144Hz",
      color: "text-yellow-500",
    },
    {
      icon: "\u{F061A}",
      label: "Memory",
      value: "4200MiB / 16384MiB",
      color: "text-cyan-500",
    },
    {
      icon: "\u{F051A}",
      label: "Uptime",
      value: uptime,
      color: "text-green-400",
    },
  ];
}

/**
 * `12s` · `12m 4s` · `1h 2m 10s` · `2d 3h 5m`.
 * Seconds are dropped once the session passes an hour so the row stays short.
 */
export function formatUptime(elapsedMs: number): string {
  const total = Math.max(0, Math.floor(elapsedMs / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

/**
 * Human name of the palette currently painted on <html>.
 *
 * The switcher writes `data-theme`, so that attribute is authoritative;
 * localStorage is the fallback for the brief window before the switcher has
 * ever run (and for the pre-paint value). Never throws — a missing or blocked
 * store just yields the default label.
 */
export function currentThemeLabel(): string {
  const fallback =
    THEMES.find((entry) => entry.id === DEFAULT_THEME)?.label ?? DEFAULT_THEME;

  if (typeof document === "undefined") return fallback;

  let id: ThemeId | null = null;

  const active = document.documentElement.getAttribute("data-theme");
  if (isThemeId(active)) {
    id = active;
  } else {
    try {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (isThemeId(stored)) id = stored;
    } catch {
      // Private mode / blocked storage — fall through to the default.
    }
  }

  return (id && THEMES.find((entry) => entry.id === id)?.label) || fallback;
}
