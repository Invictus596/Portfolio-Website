import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
  transformerAttributifyJsx
} from "unocss";

const colorReg = (prefix: string) => new RegExp("^" + prefix + "-([0-9a-z]+)(/(\\d+))?$");

const colorAttr = (prefix: string, [, color, , opacity]: RegExpMatchArray) => {
  if (["black", "white"].includes(color)) {
    const attr = `${prefix}-${color}${opacity ? "/" + opacity : ""}`;
    const darkVal = color === "white" ? "ctp-950" : "ctp-50";
    const darkAttr = `${prefix}-${darkVal}${opacity ? "/" + opacity : ""}`;
    return `${attr} dark:${darkAttr}`;
  }
  const attr = `${prefix}-gray-${color}${opacity ? "/" + opacity : ""}`;
  const inverted = (+color === 900 || +color === 50 ? 950 : 900) - +color;
  const darkAttr = `${prefix}-ctp-${inverted}${opacity ? "/" + opacity : ""}`;
  return `${attr} dark:${darkAttr}`;
};

export default defineConfig({
  theme: {
    colors: {
      ctp: {
        50: "rgb(var(--ctp-50))",
        100: "rgb(var(--ctp-100))",
        200: "rgb(var(--ctp-200))",
        300: "rgb(var(--ctp-300))",
        400: "rgb(var(--ctp-400))",
        500: "rgb(var(--ctp-500))",
        600: "rgb(var(--ctp-600))",
        700: "rgb(var(--ctp-700))",
        800: "rgb(var(--ctp-800))",
        900: "rgb(var(--ctp-900))",
        950: "rgb(var(--ctp-950))"
      }
    }
  },

  shortcuts: [
    ["flex-center", "flex items-center justify-center"],
    ["hstack", "flex items-center"],
    ["vstack", "hstack flex-col"],
    ["no-outline", "outline-none focus:outline-none"],
    [colorReg("text-c"), (v) => colorAttr("text", v)],
    [colorReg("border-c"), (v) => colorAttr("border", v)],
    [colorReg("bg-c"), (v) => colorAttr("bg", v)],
    ["shadow-menu", "shadow-md shadow-black/25 dark:shadow-black/50"],
    ["window-btn", "size-3 text-black rounded-full flex-center no-outline"],
    ["border-menu", "border-gray-500/50"],
    [
      "menu-box",
      "fixed top-8.5 text-c-black bg-c-200/90 border border-menu rounded-lg shadow-menu"
    ],
    [
      "safari-btn",
      "h-6 outline-none focus:outline-none rounded flex-center border border-c-300"
    ],
    ["cc-btn", "flex-center rounded-full size-8 text-white bg-blue-500"],
    [
      "cc-btn-active",
      "flex-center rounded-full size-8 text-c-700 bg-gray-400/25 dark:bg-gray-300/25"
    ],
    ["cc-text", "text-xs text-c-500"],
    ["cc-grid", "bg-c-200/80 rounded-xl cc-grid-shadow backdrop-blur-2xl"],
    ["battery-level", "absolute rounded-[1px] h-2 top-1/2 -mt-1 ml-0.5 left-0"]
  ],
  rules: [["cc-grid-shadow", { "box-shadow": "0px 1px 5px 0px rgba(0, 0, 0, 0.3)" }]],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      warn: true,
      extraProperties: {
        display: "inline-block"
      }
    })
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
    transformerAttributifyJsx()
  ]
});
