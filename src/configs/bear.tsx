import type { BearData } from "~/types";

const bear: BearData[] = [
  {
    id: "profile",
    title: "Profile",
    icon: "i-ion:person",
    md: [
      {
        id: "about-me",
        title: "About Me",
        file: "markdown/about-me.md",
        icon: "i-la:dragon",
        excerpt: "Student from Hyderabad, India, passionate about Data Science..."
      },
      {
        id: "github-stats",
        title: "Github Stats",
        file: "markdown/github-stats.md",
        icon: "i-icon-park-outline:github",
        excerpt: "Here are some status about my github account..."
      },
      {
        id: "about-site",
        title: "About This Site",
        file: "markdown/about-site.md",
        icon: "i-octicon:browser",
        excerpt: "Something about this personal portfolio site..."
      }
    ]
  },
  {
    id: "project",
    title: "Projects",
    icon: "i-octicon:repo",
    md: [
      {
        id: "portfolio-website",
        title: "Portfolio Website",
        file: "https://raw.githubusercontent.com/Invictus596/Portfolio-Website/main/README.md",
        icon: "i-ri:gamepad-line",
        excerpt: "macOS GUI-style portfolio website built with React, TypeScript, and Vite...",
        link: "https://github.com/Invictus596/Portfolio-Website"
      },
      {
        id: "lan-tui",
        title: "LAN-TUI",
        file: "https://raw.githubusercontent.com/Invictus596/LAN-TUI/main/README.md",
        icon: "i-carbon:terminal",
        excerpt: "Terminal UI for LAN scanning built with Rust...",
        link: "https://github.com/Invictus596/LAN-TUI"
      },
      {
        id: "kbrd",
        title: "kbrd",
        file: "https://raw.githubusercontent.com/Invictus596/kbrd/main/README.md",
        icon: "i-carbon:keyboard",
        excerpt: "Keyboard utility tool written in Rust...",
        link: "https://github.com/Invictus596/kbrd"
      },
      {
        id: "kindle-dashboard",
        title: "Kindle Dashboard",
        file: "https://raw.githubusercontent.com/Invictus596/Kindle-Dashboard/main/README.md",
        icon: "i-tabler:layout-dashboard",
        excerpt: "A Kindle reading dashboard with data visualization...",
        link: "https://github.com/Invictus596/Kindle-Dashboard"
      },
      {
        id: "zk-anticheat",
        title: "ZK Anti-Cheat",
        file: "https://raw.githubusercontent.com/Invictus596/ZK-Anti-Cheat/main/README.md",
        icon: "i-carbon:security",
        excerpt: "World's first FPS with non-invasive ZK anti-cheat on Starknet...",
        link: "https://github.com/Invictus596/ZK-Anti-Cheat"
      },
      {
        id: "obsidian-anticheat",
        title: "Obsidian AntiCheat",
        file: "https://raw.githubusercontent.com/Invictus596/Obsidian-AntiCheat/main/README.md",
        icon: "i-carbon:security",
        excerpt: "Anti-cheat system documentation and implementation...",
        link: "https://github.com/Invictus596/Obsidian-AntiCheat"
      },
      {
        id: "rift-core",
        title: "Rift Core",
        file: "https://raw.githubusercontent.com/Invictus596/rift-core/main/README.md",
        icon: "i-carbon:data-1",
        excerpt: "Core framework built with TypeScript...",
        link: "https://github.com/Invictus596/rift-core"
      },
      {
        id: "atlas-cli",
        title: "Atlas CLI",
        file: "https://raw.githubusercontent.com/Invictus596/Atlas.cli/main/README.md",
        icon: "i-carbon:terminal",
        excerpt: "CLI tool built with Makefile...",
        link: "https://github.com/Invictus596/Atlas.cli"
      },
      {
        id: "chat-agent",
        title: "Chat Agent",
        file: "https://raw.githubusercontent.com/Invictus596/Chat-Agent/main/README.md",
        icon: "i-carbon:chat-bot",
        excerpt: "A simple chatbot using Node.js, Express, and OpenAI API...",
        link: "https://github.com/Invictus596/Chat-Agent"
      },
      {
        id: "fedora-dotfiles",
        title: "Fedora Dotfiles",
        file: "https://raw.githubusercontent.com/Invictus596/Fedora-Dotfiles/master/README.md",
        icon: "i-carbon:settings",
        excerpt: "Dotfiles for my Linux setup on Fedora...",
        link: "https://github.com/Invictus596/Fedora-Dotfiles"
      },
      {
        id: "internconnect",
        title: "InternConnect",
        file: "https://raw.githubusercontent.com/Invictus596/InternConnect/main/README.md",
        icon: "i-carbon:network-3",
        excerpt: "Internship platform connecting students with opportunities...",
        link: "https://github.com/Invictus596/InternConnect"
      }
    ]
  }
];

export default bear;
