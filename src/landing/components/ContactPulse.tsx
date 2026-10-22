import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ContactPulseValue = {
  /** True for exactly PULSE_MS after the CTA is pressed. */
  isPulsating: boolean;
  /** Smooth-scroll to #contact and arm the attention pulse. */
  pulseContact: () => void;
};

const PULSE_MS = 5000;

const ContactPulseContext = createContext<ContactPulseValue | null>(null);

/**
 * Owns the "Get in touch" → contact highlight handshake.
 *
 * The CTA lives in the app bar and the hero; the buttons it should highlight
 * live in the footer. Rather than thread props through the tree (or reach for
 * a global), both sides talk to this provider.
 *
 * The pulse is deliberately time-boxed: 5s of attention, then the page goes
 * quiet again.
 */
export function ContactPulseProvider({ children }: { children: ReactNode }) {
  const [isPulsating, setIsPulsating] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  const pulseContact = useCallback(() => {
    const target = document.getElementById("contact");
    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    target?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });

    setIsPulsating(true);
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setIsPulsating(false);
    }, PULSE_MS);
  }, []);

  // Never leave a timer running past unmount.
  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  return (
    <ContactPulseContext.Provider value={{ isPulsating, pulseContact }}>
      {children}
    </ContactPulseContext.Provider>
  );
}

export function useContactPulse(): ContactPulseValue {
  const value = useContext(ContactPulseContext);

  if (!value) {
    throw new Error("useContactPulse must be used inside <ContactPulseProvider>");
  }

  return value;
}
