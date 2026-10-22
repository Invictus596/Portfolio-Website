import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { CheckIcon, ChevronDownIcon } from "../landing/components/icons";
import { MagneticHover } from "../landing/components/MagneticHover";
import { THEMES, type ThemeId } from "./themes";
import { useTheme } from "./useTheme";

/**
 * M3-flavoured theme picker.
 *
 * A pill trigger with live swatches and a listbox popover. Keyboard contract:
 * Enter/Space/ArrowDown opens, Up/Down/Home/End move, Enter picks,
 * Escape closes and returns focus to the trigger.
 */
export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selectedIndex = Math.max(
    0,
    THEMES.findIndex((entry) => entry.id === theme),
  );
  const current = THEMES[selectedIndex];

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  // Dismiss on outside pointerdown.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Move focus into the listbox on open.
  useEffect(() => {
    if (!open) return;
    optionRefs.current[selectedIndex]?.focus();
  }, [open, selectedIndex]);

  const handleListKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === "Tab") {
      setOpen(false);
      return;
    }

    const count = THEMES.length;
    const focused = optionRefs.current.indexOf(
      document.activeElement as HTMLButtonElement,
    );
    let next: number | null = null;

    if (event.key === "ArrowDown") {
      next = focused < 0 ? 0 : (focused + 1) % count;
    } else if (event.key === "ArrowUp") {
      next = focused < 0 ? count - 1 : (focused - 1 + count) % count;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = count - 1;
    }

    if (next === null) return;
    event.preventDefault();
    optionRefs.current[next]?.focus();
  };

  const choose = (id: ThemeId) => {
    setTheme(id);
    close();
  };

  return (
    <div ref={wrapRef} className="relative">
      <MagneticHover strength={4} className="flex">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((value) => !value)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" && !open) {
              event.preventDefault();
              setOpen(true);
            }
          }}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={`Color theme: ${current.label}`}
          className="flex min-h-10 items-center gap-2 rounded-full border border-outline-variant/60 bg-surface-container/70 py-1.5 pl-2 pr-2.5 text-on-surface-variant transition-colors duration-200 hover:border-outline-variant hover:text-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span aria-hidden="true" className="flex items-center -space-x-1">
            {current.swatches.map((swatch, index) => (
              <span
                key={`${swatch}-${index}`}
                className="h-3.5 w-3.5 rounded-full ring-1 ring-black/50"
                style={{ backgroundColor: swatch }}
              />
            ))}
          </span>
          <span className="m3-label hidden whitespace-nowrap sm:inline">
            {current.label}
          </span>
          <ChevronDownIcon
            className={`h-3.5 w-3.5 shrink-0 transition-transform duration-[var(--md-spring-fast-spatial-duration)] ease-[var(--md-spring-fast-spatial)] ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </MagneticHover>

      {open ? (
        <div
          role="listbox"
          aria-label="Color themes"
          onKeyDown={handleListKeyDown}
          className="absolute left-0 top-full z-50 mt-2 max-h-[min(70vh,24rem)] w-[16.5rem] overflow-y-auto rounded-[var(--radius-lg)] border border-outline-variant/70 bg-surface-container p-1.5 shadow-[var(--md-elevation-3)]"
        >
          {THEMES.map((entry, index) => {
            const active = entry.id === theme;
            return (
              <button
                key={entry.id}
                ref={(node) => {
                  optionRefs.current[index] = node;
                }}
                type="button"
                role="option"
                aria-selected={active}
                tabIndex={-1}
                onClick={() => choose(entry.id)}
                className={[
                  "flex w-full items-center gap-3 rounded-[var(--radius-md)] px-2.5 py-2 text-left transition-colors duration-150",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-primary",
                  active
                    ? "bg-primary-container/70 text-on-primary-container"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
                ].join(" ")}
              >
                <span aria-hidden="true" className="flex items-center -space-x-1">
                  {entry.swatches.map((swatch, swatchIndex) => (
                    <span
                      key={`${swatch}-${swatchIndex}`}
                      className="h-3 w-3 rounded-full ring-1 ring-black/50"
                      style={{ backgroundColor: swatch }}
                    />
                  ))}
                </span>
                <span className="m3-body-sm flex-1 truncate">
                  {entry.label}
                </span>
                {active ? (
                  <CheckIcon className="h-4 w-4 shrink-0 text-primary" />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
