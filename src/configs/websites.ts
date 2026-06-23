import type { WebsitesData } from "~/types";

const websites: WebsitesData = {
  favorites: {
    title: "SNS Links",
    sites: [
      {
        id: "my-github",
        title: "Github",
        img: "img/sites/github.svg",
        link: "https://github.com/Invictus596"
      },
      {
        id: "my-portfolio",
        title: "Portfolio",
        img: "img/ui/avatar.jpg",
        link: "https://invictus596-portfolio.vercel.app/",
        inner: true
      },
      {
        id: "my-email",
        title: "Email",
        img: "img/sites/gmail.svg",
        link: "mailto:abdulkhader.dev@gmail.com"
      }
    ]
  },
  freq: {
    title: "Frequently Visited",
    sites: [
      {
        id: "github",
        title: "Github",
        img: "img/sites/github.svg",
        link: "https://github.com/"
      },
      {
        id: "stackoverflow",
        title: "Stack Overflow",
        img: "https://cdn.sstatic.net/Sites/stackoverflow/img/apple-touch-icon.png",
        link: "https://stackoverflow.com/"
      },
      {
        id: "reddit",
        title: "Reddit",
        img: "img/sites/reddit.svg",
        link: "https://www.reddit.com/"
      },
      {
        id: "hacker-news",
        title: "Hacker News",
        img: "img/sites/hacker.svg",
        link: "https://news.ycombinator.com/"
      },
      {
        id: "leetcode",
        title: "LeetCode",
        img: "img/sites/leetcode.svg",
        link: "https://leetcode.com/"
      },
      {
        id: "python-docs",
        title: "Python Docs",
        img: "https://www.python.org/static/apple-touch-icon.png",
        link: "https://docs.python.org/"
      },
      {
        id: "mdn",
        title: "MDN Web Docs",
        img: "https://developer.mozilla.org/apple-touch-icon.png",
        link: "https://developer.mozilla.org/"
      },
      {
        id: "npm",
        title: "npm",
        img: "https://static.npmjs.com/7a7ffabbd910fc60161bc04f2cee4160.png",
        link: "https://www.npmjs.com/"
      },
      {
        id: "steam",
        title: "Steam",
        img: "img/sites/steam.svg",
        link: "https://store.steampowered.com/"
      },
      {
        id: "arxiv",
        title: "arXiv",
        img: "img/sites/arxiv.png",
        link: "https://arxiv.org/"
      }
    ]
  }
};

export default websites;
