import { Fragment, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  PALETTE,
  VENOM_LOGO,
  currentThemeLabel,
  formatUptime,
  specRows,
} from "./fastfetch";
import { ShutdownOverlay } from "./ShutdownOverlay";

type Phase = "active" | "shutting-down" | "unlocked";

type HistoryEntry = {
  id: number;
  kind: "command" | "output";
  text: string;
  tone?: "error" | "muted";
};

type FastfetchSnapshot = {
  theme: string;
  uptime: string;
};

const PROMPT = "stormsite@invictus:~";

/**
 * Renders the `fastfetch` output: logo on the left, spec list on the right.
 *
 * Kept presentational — every value arrives as a prop — so the same markup can
 * be rendered in tests without a live terminal. The icon spans use a fixed
 * width so a missing Nerd Font glyph cannot shift the key column.
 */
export function FastfetchOutput({
  theme,
  uptime,
}: {
  theme: string;
  uptime: string;
}) {
  const rows = specRows(theme, uptime);

  return (
    <div className="text-[10.5px] leading-[1.45] sm:text-[11px]">
      <div className="flex items-center gap-5">
        <pre
          aria-hidden="true"
          className="fastfetch-logo hidden shrink-0 select-none text-[10px] font-bold leading-[1.15] text-primary sm:block"
        >
          {VENOM_LOGO}
        </pre>

        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 leading-[1.5]">
            <span
              aria-hidden="true"
              className="fastfetch-icon w-3.5 shrink-0 text-center text-blue-500"
            >
              {"\uF007"}
            </span>
            <span>
              <span className="font-semibold text-blue-500">stormsite</span>
              <span className="text-on-surface-variant">@</span>
              <span className="font-semibold text-blue-500">invictus</span>
            </span>
          </p>

          <p aria-hidden="true" className="mb-1.5 text-on-surface-variant/40">
            {"─".repeat(18)}
          </p>

          <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-3 gap-y-px">
            {rows.map((row) => (
              <Fragment key={row.label}>
                <span className="flex items-center gap-2 whitespace-nowrap">
                  <span
                    aria-hidden="true"
                    className={`fastfetch-icon w-3.5 shrink-0 text-center ${row.color}`}
                  >
                    {row.icon}
                  </span>
                  <span className={row.color}>{row.label}</span>
                </span>
                <span className="min-w-0 text-on-surface">{row.value}</span>
              </Fragment>
            ))}
          </div>

          <div className="mt-2 flex items-center gap-1.5" aria-hidden="true">
            {PALETTE.map((color) => (
              <span key={color} className={`h-2 w-2 rounded-full ${color}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The 2D counterpart of the terminal inside the 3D scene — now a real
 * terminal with a tiny command state machine.
 *
 *   restart    → hard reload
 *   ls         → "not authorized lol", in red
 *   fastfetch  → clears the scrollback and shows the system readout
 *   shutdown   → hands over to <ShutdownOverlay> (CRT power-off + login)
 *
 * A successful login flips this card to `unlocked` for the rest of the
 * session: the input unmounts (so the caret is gone and typing is disabled)
 * and the reward line takes its place.
 */
export function TerminalCard() {
  const [phase, setPhase] = useState<Phase>("active");
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [fastfetch, setFastfetch] = useState<FastfetchSnapshot | null>(null);

  const idRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  /** Page navigation time; refined once on mount. */
  const bootedAtRef = useRef<number>(Date.now());

  useEffect(() => {
    bootedAtRef.current =
      typeof performance !== "undefined" && performance.timeOrigin
        ? performance.timeOrigin
        : Date.now();
  }, []);

  // The switcher only writes `<html data-theme>`, so mirror it while the
  // readout is open — toggling the palette should be visible immediately.
  const fastfetchOpen = fastfetch !== null;

  useEffect(() => {
    if (!fastfetchOpen) return;

    const observer = new MutationObserver(() => {
      setFastfetch((prev) =>
        prev ? { ...prev, theme: currentThemeLabel() } : prev,
      );
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, [fastfetchOpen]);

  const makeEntry = (
    kind: HistoryEntry["kind"],
    text: string,
    tone?: HistoryEntry["tone"],
  ): HistoryEntry => ({ id: idRef.current++, kind, text, tone });

  const runCommand = (raw: string) => {
    const command = raw.trim();
    setValue("");
    if (!command) return;

    if (command === "fastfetch") {
      // Scrollback is wiped so the readout always starts at the top of the
      // card — nothing to scroll past, nothing clipped.
      setHistory([]);
      const startedAt = bootedAtRef.current || Date.now();
      setFastfetch({
        theme: currentThemeLabel(),
        uptime: formatUptime(Date.now() - startedAt),
      });
      return;
    }

    // Anything else drops back to the normal shell view.
    setFastfetch(null);

    if (command === "restart") {
      window.location.reload();
      return;
    }

    if (command === "shutdown") {
      const shutdownEntry = makeEntry("command", command);
      setHistory((prev) => [...prev, shutdownEntry].slice(-4));
      inputRef.current?.blur();
      setPhase("shutting-down");
      return;
    }

    const next = [makeEntry("command", command)];
    if (command === "ls") {
      next.push(makeEntry("output", "not authorized lol", "error"));
    } else {
      next.push(makeEntry("output", `command not found: ${command}`, "muted"));
    }

    setHistory((prev) => [...prev, ...next].slice(-4));
  };

  return (
    <div className="relative">
      {/* Ambient glow, tied to the primary role. */}
      <div
        aria-hidden="true"
        className="absolute -inset-6 -z-10 rounded-[48px] bg-primary/8 blur-3xl"
      />

      <div
        className="m3-surface relative cursor-text overflow-hidden border border-outline-variant/60 bg-surface-container/85 shadow-[var(--md-elevation-3)] backdrop-blur-xl"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex items-center gap-2 border-b border-outline-variant/50 px-5 py-3">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-error/70" />
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-tertiary/60" />
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-primary/60" />
          <span className="m3-mono ml-2 text-[11px] text-on-surface-variant">
            {PROMPT}
          </span>
        </div>

        <div
          className={`m3-mono px-5 text-[12.5px] leading-6 ${
            fastfetch ? "py-4" : "space-y-1.5 py-5"
          }`}
        >
          {fastfetch ? (
            <FastfetchOutput theme={fastfetch.theme} uptime={fastfetch.uptime} />
          ) : (
            <>
              <p>
                <span className="text-primary">$</span>{" "}
                <span className="text-on-surface">whoami</span>
              </p>
              <p className="text-on-surface-variant">
                CSE graduate @ Osmania University
              </p>

              <p className="pt-3">
                <span className="text-primary">$</span>{" "}
                <span className="text-on-surface">currently_building</span>
              </p>
              <p className="text-on-surface-variant">
                <span className="text-tertiary">→</span> trustless systems on
                Starknet
              </p>
              <p className="text-on-surface-variant">
                <span className="text-tertiary">→</span> zero-knowledge proof
                infrastructure
              </p>
              <p className="text-on-surface-variant">
                <span className="text-tertiary">→</span> efficient ML models
              </p>

              {history.length > 0 ? (
                <div className="space-y-1.5 pt-3">
                  {history.map((entry) =>
                    entry.kind === "command" ? (
                      <p key={entry.id}>
                        <span className="text-primary">$</span>{" "}
                        <span className="text-on-surface">{entry.text}</span>
                      </p>
                    ) : (
                      <p
                        key={entry.id}
                        className={
                          entry.tone === "error"
                            ? "text-red-500"
                            : "text-on-surface-variant/70"
                        }
                      >
                        {entry.text}
                      </p>
                    ),
                  )}
                </div>
              ) : null}
            </>
          )}

          {phase === "unlocked" ? (
            <p className="pt-3 text-yellow-400">
              thanks for finding the easter egg
            </p>
          ) : (
            <form
              className="flex items-center gap-2 pt-3"
              onSubmit={(event) => {
                event.preventDefault();
                runCommand(value);
              }}
            >
              <span className="text-primary">$</span>
              <input
                ref={inputRef}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                className="terminal-input min-w-0 flex-1 bg-transparent text-[12.5px] text-on-surface outline-none placeholder:text-on-surface-variant/40"
                placeholder="type a command…"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                aria-label="Terminal command"
              />
            </form>
          )}
        </div>
      </div>

      {phase === "shutting-down"
        ? createPortal(
            <ShutdownOverlay
              onSuccess={() => {
                setFastfetch(null);
                setPhase("unlocked");
              }}
            />,
            document.body,
          )
        : null}
    </div>
  );
}
