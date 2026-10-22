import { Fragment, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  PALETTE,
  VENOM_LOGO,
  currentThemeLabel,
  formatUptime,
  specRows,
} from "./fastfetch";
import { ShutdownOverlay } from "./ShutdownOverlay";
import { interpretCommand } from "./terminal-commands";

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

/** Scrollback cap; the shell panel scrolls, so this is just a memory guard. */
const MAX_ENTRIES = 60;

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
 * The 2D counterpart of the terminal inside the 3D scene — a small shell with
 * a real command state machine.
 *
 *   help        → the command list
 *   clear       → wipes the scrollback (intro included), keeps the session log
 *   whoami      → name | role
 *   pwd         → the fake project directory
 *   cd 3d|/3d   → navigates to the WebGL route
 *   cd ..       → permission denied
 *   cat X       → resume (opens LinkedIn), paper.md (abstract), or ENOENT
 *   sudo        → the sudoers refusal, in red
 *   echo X      → X, verbatim
 *   history     → numbered list of every command this session
 *   neofetch    → the "did you mean fastfetch" gag
 *   ls          → "not authorized lol", in red
 *   fastfetch   → clears the scrollback and shows the system readout
 *   restart     → hard reload
 *   shutdown    → hands over to <ShutdownOverlay> (CRT power-off + login)
 *
 * A successful login flips this card to `unlocked` for the rest of the
 * session: the input unmounts (so the caret is gone and typing is disabled)
 * and the reward line takes its place.
 */
export function TerminalCard() {
  const navigate = useNavigate();

  const [phase, setPhase] = useState<Phase>("active");
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  /** Commands typed this session — survives `clear`, unlike the scrollback. */
  const [commandLog, setCommandLog] = useState<string[]>([]);
  const [fastfetch, setFastfetch] = useState<FastfetchSnapshot | null>(null);
  /** `clear` hides the boot banner so only the prompt is left. */
  const [showIntro, setShowIntro] = useState(true);

  const idRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
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

  // Follow the tail of the scrollback, like a real terminal.
  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [history, showIntro]);

  const makeEntry = (
    kind: HistoryEntry["kind"],
    text: string,
    tone?: HistoryEntry["tone"],
  ): HistoryEntry => ({ id: idRef.current++, kind, text, tone });

  const runCommand = (raw: string) => {
    const command = raw.trim();
    setValue("");
    if (!command) return;

    // Logged before dispatch so `history` lists itself, as bash does.
    const nextLog = [...commandLog, command];
    setCommandLog(nextLog);

    const result = interpretCommand(command, nextLog);

    if (result.fastfetch) {
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

    if (result.reload) {
      window.location.reload();
      return;
    }

    if (result.clear) {
      setHistory([]);
      setShowIntro(false);
      return;
    }

    if (result.shutdown) {
      setHistory((prev) =>
        [...prev, makeEntry("command", command)].slice(-MAX_ENTRIES),
      );
      inputRef.current?.blur();
      setPhase("shutting-down");
      return;
    }

    if (result.navigateTo) {
      navigate(result.navigateTo);
      return;
    }

    if (result.openUrl) {
      window.open(result.openUrl, "_blank", "noopener,noreferrer");
    }

    setHistory((prev) =>
      [
        ...prev,
        makeEntry("command", command),
        ...result.outputs.map((line) =>
          makeEntry("output", line.text, line.tone),
        ),
      ].slice(-MAX_ENTRIES),
    );
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
            fastfetch ? "py-4" : "py-5"
          }`}
        >
          {fastfetch ? (
            <FastfetchOutput theme={fastfetch.theme} uptime={fastfetch.uptime} />
          ) : (
            <>
              <div
                ref={scrollRef}
                className="terminal-scroll max-h-[17rem] space-y-1.5 overflow-y-auto pr-1.5"
              >
                {showIntro ? (
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
                      <span className="text-tertiary">→</span> trustless systems
                      on Starknet
                    </p>
                    <p className="text-on-surface-variant">
                      <span className="text-tertiary">→</span> zero-knowledge
                      proof infrastructure
                    </p>
                    <p className="text-on-surface-variant">
                      <span className="text-tertiary">→</span> efficient ML
                      models
                    </p>
                  </>
                ) : null}

                {history.map((entry) =>
                  entry.kind === "command" ? (
                    <p key={entry.id} className="break-words">
                      <span className="text-primary">$</span>{" "}
                      <span className="text-on-surface">{entry.text}</span>
                    </p>
                  ) : (
                    <p
                      key={entry.id}
                      className={`whitespace-pre-wrap break-words ${
                        entry.tone === "error"
                          ? "text-red-500"
                          : "text-on-surface-variant/70"
                      }`}
                    >
                      {entry.text}
                    </p>
                  ),
                )}
              </div>

              {phase === "unlocked" ? (
                <p className="pt-3 text-yellow-400">
                  You Unlocked the Easter Egg
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
                    placeholder="type help…"
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    aria-label="Terminal command"
                  />
                </form>
              )}
            </>
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
