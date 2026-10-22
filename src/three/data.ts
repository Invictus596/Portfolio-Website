/**
 * Single source of truth for portfolio projects.
 *
 * Consumed by both the 2D landing page (`src/landing/sections/Projects.tsx`)
 * and the 3D scene (`src/three/ProjectTexts`), so copy only ever lives here.
 */

export type Project = {
  /** Display title. */
  title: string;
  /** Two-line description used by the 3D pane; `\n` is a hard line break. */
  desc: string;
  /** Destination for "view project". */
  url: string;
  /** Short technology labels rendered as chips on the 2D site. */
  tags: string[];
  /**
   * Optional award/placement line. When present the 2D card renders it as a
   * trophy badge above the description.
   */
  award?: string;
  /** Pane coordinates inside the 3D project chamber. */
  x: number;
  y: number;
};

export const PROJECTS: Project[] = [
  {
    title: "OBSIDIAN ANTI-CHEAT",
    desc: "Blockchain security system.\nTop 11 Finalist built with Cairo & Next.js.",
    url: "https://github.com/Invictus596/Obsidian-Anti-Cheat",
    tags: ["Cairo", "Next.js", "Web3"],
    award: "2nd Place @ HackPrix BuildWith Hackathon",
    x: -2.45,
    y: 1.4,
  },
  {
    title: "LAN-TUI",
    desc: "Terminal-based network interface.\nLightweight TUI for local diagnostics.",
    url: "https://github.com/Invictus596",
    tags: ["TUI", "Networking"],
    x: -2.45,
    y: -1.4,
  },
  {
    title: "KBRD",
    desc: "Custom keyboard utility.\nAdvanced mapping for mechanical boards.",
    url: "https://github.com/Invictus596",
    tags: ["Tooling", "Systems"],
    x: 2.45,
    y: -1.4,
  },
];

/** Flattens the 3D-hard-wrapped description into a single readable sentence. */
export function projectSummary(project: Project): string {
  return project.desc.replace(/\n/g, " ");
}

export const PROFILE = {
  name: "Abdul Khader",
  role: "Multi-disciplinary Software Engineer",
  academic: "Osmania University CSE Graduate (Graduated Sept 2026)",
  email: "abdulkhader.dev@gmail.com",
  github: "https://github.com/Invictus596",
  linkedin: "https://www.linkedin.com/in/invictus596/",
} as const;

/**
 * Peer-reviewed publication.
 *
 * Rendered as its own showcase band on the landing page — it is an
 * announcement, not a repository, so it does not belong in `PROJECTS`.
 */
export const PUBLICATION = {
  title: "Research Paper Publication",
  /** Kept short and factual: the only verifiable claims from the DOI link. */
  venue: "Peer-reviewed and open access in IJMEC",
  url: "https://ijmec.com/index.php/multidisciplinary/article/view/1046",
} as const;
