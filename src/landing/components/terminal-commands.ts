import { PROFILE, PUBLICATION } from "../../three/data";

/** How an output line should be coloured. Plain outputs are grey. */
export type OutputTone = "error" | "muted";

export type CommandOutput = {
  text: string;
  tone?: OutputTone;
};

/**
 * Everything a command can ask the terminal to do. Keeping this as data makes
 * the parser pure: `TerminalCard` owns the state, this module owns the rules.
 */
export type CommandResult = {
  outputs: CommandOutput[];
  /** Route to push, e.g. `cd 3d`. */
  navigateTo?: string;
  /** External URL to open in a new tab, e.g. `cat resume.pdf`. */
  openUrl?: string;
  /** Wipe the scrollback (and the boot banner), e.g. `clear`. */
  clear?: boolean;
  reload?: boolean;
  shutdown?: boolean;
  /** Show the system readout instead of shell output. */
  fastfetch?: boolean;
};

export const HELP_TEXT =
  "Available commands: help, clear, whoami, cd, cat, pwd, sudo, history, echo, neofetch, fastfetch, ls, restart, shutdown";

export const NEOFETCH_TEXT =
  "zsh: command not found: neofetch. Did you mean 'fastfetch'? (neofetch is dead, long live fastfetch)";

export const SUDO_TEXT =
  "invictus is not in the sudoers file. This incident will be reported.";

export const PWD_TEXT = "/home/invictus/projects/portfolio-v2";

export const WHOAMI_TEXT =
  "Abdul Khader | Software Engineer & Data Scientist";

/**
 * No PDF ships in /public yet, so `cat resume.pdf` opens the LinkedIn profile
 * as the closest public stand-in. Drop a `public/resume.pdf` in and point this
 * at "/resume.pdf" once one exists.
 */
export const RESUME_URL = PROFILE.linkedin;

const out = (text: string, tone?: OutputTone): CommandResult => ({
  outputs: [{ text, tone }],
});

/**
 * Resolve one submitted command line into effects.
 *
 * `sessionLog` is the full log *including* the command being resolved, so
 * `history` lists itself the way bash does. Meta commands (`fastfetch`,
 * `restart`, `clear`, `shutdown`) match only when typed bare; everything else
 * dispatches on its first word so `cd 3d` and `sudo -i` work.
 */
export function interpretCommand(
  command: string,
  sessionLog: readonly string[],
): CommandResult {
  switch (command) {
    case "":
      return { outputs: [] };
    case "fastfetch":
      return { outputs: [], fastfetch: true };
    case "restart":
      return { outputs: [], reload: true };
    case "clear":
      return { outputs: [], clear: true };
    case "shutdown":
      return { outputs: [], shutdown: true };
  }

  const [verb, ...rest] = command.split(/\s+/);
  const arg = rest.join(" ");

  switch (verb) {
    case "help":
      return out(HELP_TEXT);

    case "whoami":
      return out(WHOAMI_TEXT);

    case "pwd":
      return out(PWD_TEXT);

    case "history":
      return out(
        sessionLog
          .map((entry, index) => `${index + 1}  ${entry}`)
          .join("\n"),
      );

    case "echo": {
      // `command` arrives trimmed; this keeps everything after `echo`
      // verbatim, including interior spacing.
      const echo = /^echo(?:\s+([\s\S]*))?$/.exec(command);
      return out(echo?.[1] ?? "");
    }

    case "sudo":
      return out(SUDO_TEXT, "error");

    case "neofetch":
      return out(NEOFETCH_TEXT, "error");

    case "ls":
      return out("not authorized lol", "error");

    case "cd":
      if (arg === "3d" || arg === "/3d") {
        return { outputs: [], navigateTo: "/3d" };
      }
      return out(
        arg === ".."
          ? "bash: cd: ..: Permission denied"
          : arg
            ? `bash: cd: ${arg}: No such file or directory`
            : "bash: cd: missing operand",
        "error",
      );

    case "cat":
      if (arg === "resume.pdf") {
        return {
          outputs: [{ text: "Opening resume..." }],
          openUrl: RESUME_URL,
        };
      }
      if (arg === "paper.md") {
        return out(
          `Abstract: A peer-reviewed research paper. Read full at: ${PUBLICATION.url}`,
        );
      }
      return out(
        arg
          ? `cat: ${arg}: No such file or directory`
          : "cat: missing operand",
        "error",
      );

    default:
      return out(`command not found: ${command}`, "muted");
  }
}
