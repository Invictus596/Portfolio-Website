import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeExternalLinks from "rehype-external-links";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula, prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import bear from "~/configs/bear";
import { useWindowSize } from "~/hooks/useWindowSize";
import type { BearMdData } from "~/types";

interface ContentProps {
  contentID: string;
  contentURL: string;
}

interface MiddlebarProps {
  items: BearMdData[];
  cur: number;
  setContent: (id: string, url: string, index: number) => void;
}

interface SidebarProps {
  cur: number;
  setMidBar: (items: BearMdData[], index: number) => void;
}

interface BearState extends ContentProps {
  curSidebar: number;
  curMidbar: number;
  midbarList: BearMdData[];
}

const Highlighter = (dark: boolean): any => {
  interface codeProps {
    node: any;
    inline: boolean;
    className: string;
    children: any;
  }

  return {
    code({ node, inline, className, children, ...props }: codeProps) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={dark ? dracula : prism}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className}>{children}</code>
      );
    }
  };
};

const Sidebar = ({ cur, setMidBar }: SidebarProps) => {
  return (
    <div text-white>
      <div className="h-12 pr-3 hstack space-x-3 justify-end">
        <span className="i-ic:baseline-cloud-off text-xl" />
        <span className="i-akar-icons:settings-vertical text-xl" />
      </div>
      <ul>
        {bear.map((item, index) => (
          <li
            key={`bear-sidebar-${item.id}`}
            className={`pl-6 h-8 hstack cursor-default ${
              cur === index ? "bg-red-500" : "bg-transparent"
            } ${cur === index ? "" : "hover:bg-gray-600"}`}
            onClick={() => setMidBar(item.md, index)}
          >
            <span className={item.icon} />
            <span className="ml-2">{item.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Middlebar = ({ items, cur, setContent }: MiddlebarProps) => {
  return (
    <ul>
      {items.map((item: BearMdData, index: number) => (
        <li
          key={`bear-midbar-${item.id}`}
          className={`h-24 flex flex-col cursor-default border-l-2 ${
            cur === index
              ? "border-red-500 bg-white dark:bg-gray-900"
              : "border-transparent bg-transparent"
          } hover:(bg-white dark:bg-gray-900)`}
          onClick={() => setContent(item.id, item.file, index)}
        >
          <div className="h-8 mt-3 hstack">
            <div className="-mt-1 w-10 vstack text-c-500">
              <span className={item.icon} />
            </div>
            <span className="relative flex-1 font-bold" text="gray-900 dark:gray-100">
              {item.title}
              {item.link && (
                <a
                  pos="absolute top-1 right-4"
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="i-ant-design:link-outlined text-c-500" />
                </a>
              )}
            </span>
          </div>
          <div className="flex-1 ml-10" p="b-2 r-1" text="sm c-500" border="b c-300">
            {item.excerpt}
          </div>
        </li>
      ))}
    </ul>
  );
};

const getRepoURL = (url: string) => {
  return url.slice(0, -10) + "/";
};

const fixImageURL = (text: string, contentURL: string): string => {
  text = text.replace(/&nbsp;/g, "");
  if (contentURL.indexOf("raw.githubusercontent.com") !== -1) {
    const repoURL = getRepoURL(contentURL);

    const imgReg = /!\[(.*?)\]\((.*?)\)/;
    const imgRegGlobal = /!\[(.*?)\]\((.*?)\)/g;

    const imgList = text.match(imgRegGlobal);

    if (imgList) {
      for (const img of imgList) {
        const imgURL = (img.match(imgReg) as Array<string>)[2];
        if (imgURL.indexOf("http") !== -1) continue;
        const newImgURL = repoURL + imgURL;
        text = text.replace(imgURL, newImgURL);
      }
    }
  }
  return text;
};

const Content = ({ contentID, contentURL }: ContentProps) => {
  const [storeMd, setStoreMd] = useState<{ [key: string]: string }>({});
  const dark = useStore((state) => state.dark);

  const fetchMarkdown = useCallback(
    (id: string, url: string) => {
      if (!storeMd[id]) {
        fetch(url)
          .then((response) => response.text())
          .then((text) => {
            storeMd[id] = fixImageURL(text, url);
            setStoreMd({ ...storeMd });
          })
          .catch((error) => console.error(error));
      }
    },
    [storeMd]
  );

  useEffect(() => {
    fetchMarkdown(contentID, contentURL);
  }, [contentID, contentURL, fetchMarkdown]);

  return (
    <div className="markdown w-full sm:w-2/3 sm:mx-auto px-4 sm:px-2 py-6 text-c-700">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          rehypeKatex,
          [rehypeExternalLinks, { target: "_blank", rel: "noopener noreferrer" }]
        ]}
        components={Highlighter(dark as boolean)}
      >
        {storeMd[contentID]}
      </ReactMarkdown>
    </div>
  );
};

const Bear = () => {
  const [state, setState] = useState<BearState>({
    curSidebar: 0,
    curMidbar: 0,
    midbarList: bear[0].md,
    contentID: bear[0].md[0].id,
    contentURL: bear[0].md[0].file
  });

  const { winWidth } = useWindowSize();
  const isMobile = winWidth < 768;
  const [view, setView] = useState<"list" | "detail">("list");

  const setMidBar = (items: BearMdData[], index: number) => {
    setState({
      curSidebar: index,
      curMidbar: 0,
      midbarList: items,
      contentID: items[0].id,
      contentURL: items[0].file
    });
  };

  const setContent = (id: string, url: string, index: number) => {
    setState({
      ...state,
      curMidbar: index,
      contentID: id,
      contentURL: url
    });
  };

  const openItem = (catIndex: number, itemIndex: number) => {
    const items = bear[catIndex].md;
    const item = items[itemIndex];
    setState({
      curSidebar: catIndex,
      curMidbar: itemIndex,
      midbarList: items,
      contentID: item.id,
      contentURL: item.file
    });
    setView("detail");
  };

  if (isMobile) {
    return (
      <div className="bear font-avenir h-full flex flex-col bg-zinc-100 dark:bg-black">
        {view === "list" ? (
          <>
            <div className="flex items-center justify-between px-4 h-12 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
              <span className="text-lg font-bold text-zinc-900 dark:text-white">Bear</span>
              <div className="hstack space-x-4">
                <span className="i-ic:baseline-cloud-off text-xl text-zinc-400" />
                <span className="i-akar-icons:settings-vertical text-xl text-zinc-400" />
              </div>
            </div>
            <div className="mx-3 mt-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30">
              <p className="text-amber-700 dark:text-amber-400 text-xs leading-relaxed">
                For the best experience, please use a desktop device.
              </p>
            </div>
            <div className="flex-1 overflow-auto px-3 mt-3 space-y-5 pb-6">
              {bear.map((category, catIndex) => (
                <div key={`section-${category.id}`}>
                  <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5 px-1">
                    {category.title}
                  </p>
                  <div className="rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
                    {category.md.map((item, itemIndex) => (
                      <div
                        key={`row-${item.id}`}
                        className={`flex items-center px-4 py-3.5 cursor-default active:bg-zinc-100 dark:active:bg-zinc-800 ${
                          itemIndex < category.md.length - 1 ? "border-b border-zinc-100 dark:border-zinc-800" : ""
                        }`}
                        onClick={() => openItem(catIndex, itemIndex)}
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 mr-3 shrink-0">
                          <span className={`${item.icon} text-zinc-600 dark:text-zinc-300`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                            {item.title}
                          </p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
                            {item.excerpt}
                          </p>
                        </div>
                        <span className="text-zinc-300 dark:text-zinc-600 ml-2 text-lg">›</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center h-12 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
              <button
                className="flex items-center px-3 h-full text-blue-500 text-sm font-medium cursor-default"
                onClick={() => setView("list")}
              >
                ‹ Back
              </button>
              <span className="text-base font-semibold text-zinc-900 dark:text-white truncate pr-4">
                {state.midbarList[state.curMidbar]?.title}
              </span>
            </div>
            <div className="flex-1 overflow-auto bg-white dark:bg-black">
              <Content contentID={state.contentID} contentURL={state.contentURL} />
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="bear font-avenir flex h-full">
      <div className="w-44 overflow-auto bg-gray-700">
        <Sidebar cur={state.curSidebar} setMidBar={setMidBar} />
      </div>
      <div className="w-60 overflow-auto" bg="gray-50 dark:gray-800" border="r c-300">
        <Middlebar
          items={state.midbarList}
          cur={state.curMidbar}
          setContent={setContent}
        />
      </div>
      <div className="flex-1 overflow-auto" bg="gray-50 dark:gray-800">
        <Content contentID={state.contentID} contentURL={state.contentURL} />
      </div>
    </div>
  );
};

export default Bear;
