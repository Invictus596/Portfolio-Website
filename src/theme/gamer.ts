import { useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY } from "./themes";

/**
 * Persisted flag for the terminal easter egg reward.
 *
 * Kept separate from the theme key on purpose: choosing another palette must
 * not re-lock the gamer theme. The two are *related* only in one direction —
 * a stored `gamer` theme is itself proof of an unlock, which covers browsers
 * that prune the flag but keep the palette.
 */
export const GAMER_UNLOCK_KEY = "portfolio-gamer-unlocked";

const listeners = new Set<() => void>();

/** `null` until the first read, so localStorage is only touched in a browser. */
let unlocked: boolean | null = null;

function readUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (window.localStorage.getItem(GAMER_UNLOCK_KEY) === "1") return true;
    return window.localStorage.getItem(THEME_STORAGE_KEY) === "gamer";
  } catch {
    // Private mode / blocked storage — stay locked rather than throwing.
    return false;
  }
}

function getSnapshot(): boolean {
  if (unlocked === null) unlocked = readUnlocked();
  return unlocked;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Flips the unlock, persists it, and re-renders every subscriber. */
export function unlockGamer() {
  unlocked = true;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(GAMER_UNLOCK_KEY, "1");
    } catch {
      // Best-effort persistence; the in-memory flag still applies.
    }
  }
  listeners.forEach((listener) => listener());
}

/** Non-reactive read, handy for logic outside a component render. */
export function isGamerUnlocked(): boolean {
  return getSnapshot();
}

/** Reactive read: true once the easter egg has been solved in this browser. */
export function useGamerUnlocked(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
