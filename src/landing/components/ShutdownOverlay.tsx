import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

const LOGIN = "invictus";
const PASSWORD = "abdulkhader";

/**
 * Full-screen "system offline" state.
 *
 * Rendered through a portal on <body> so it sits above the sticky app bar and
 * escapes the terminal card's transform context. The CRT power-off is pure
 * CSS: a white raster collapses to a horizontal line, the line to a dot, and
 * the dot dies into black while the login fades in.
 *
 * On success the parent unmounts this instantly — no exit animation, exactly
 * as if the machine never went down.
 */
export function ShutdownOverlay({ onSuccess }: { onSuccess: () => void }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const loginRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Take focus immediately: the prompt is still fading in, but keystrokes
  // land in the right field from the first frame.
  useEffect(() => {
    loginRef.current?.focus();
  }, []);

  // The page behind must not scroll while the machine is offline.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (login.trim() === LOGIN && password === PASSWORD) {
      onSuccess();
      return;
    }

    setError(true);
    setPassword("");
    passwordRef.current?.focus();
  };

  return (
    <div
      className="crt-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="System offline"
    >
      {/* The collapsing raster. Decorative, so it is hidden from AT. */}
      <div className="crt-screen" aria-hidden="true" />

      <form className="crt-login" onSubmit={handleSubmit}>
        <p className="crt-system">system offline</p>

        <label className="crt-field">
          <span className="crt-label">login:</span>
          <input
            ref={loginRef}
            value={login}
            onChange={(event) => {
              setLogin(event.target.value);
              setError(false);
            }}
            className="crt-input"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label="login"
          />
        </label>

        <label className="crt-field">
          <span className="crt-label">password:</span>
          <input
            ref={passwordRef}
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError(false);
            }}
            className="crt-input"
            autoComplete="off"
            aria-label="password"
          />
        </label>

        {error ? (
          <p className="crt-error" role="alert">
            access denied
          </p>
        ) : null}

        <button type="submit" className="crt-submit">
          authenticate
        </button>
      </form>
    </div>
  );
}
