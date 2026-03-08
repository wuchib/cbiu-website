"use client"

import * as React from "react"
import { Check, Copy, Palette } from "lucide-react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import {
  vscDarkPlus,
  oneDark,
  dracula,
  materialOceanic, // 代替 materialDark
  oneLight, // 应该存在于 prism 中
  ghcolors, // 对应 github
} from "react-syntax-highlighter/dist/esm/styles/prism"

const THEMES = {
  "VSC Dark": vscDarkPlus,
  "One Dark": oneDark,
  "Dracula": dracula,
  "Material": materialOceanic,
  "One Light": oneLight,
  "GitHub": ghcolors,
}

type ThemeKey = keyof typeof THEMES

export function CodeBlock({ className, children, node, ...props }: any) {
  const [isCopied, setIsCopied] = React.useState(false)
  const [currentTheme, setCurrentTheme] = React.useState<ThemeKey>("VSC Dark")
  const [isThemeMenuOpen, setIsThemeMenuOpen] = React.useState(false)

  const match = /language-(\w+)/.exec(className || "")
  const language = match ? match[1] : ""

  // Hydration 安全处理：读取本地主题配置
  React.useEffect(() => {
    const savedTheme = localStorage.getItem("cbiu-code-theme") as ThemeKey
    if (savedTheme && THEMES[savedTheme]) {
      setCurrentTheme(savedTheme)
    }
  }, [])

  const handleThemeChange = (theme: ThemeKey) => {
    setCurrentTheme(theme)
    localStorage.setItem("cbiu-code-theme", theme)
    setIsThemeMenuOpen(false)
  }

  // react-markdown 传下来的 children 是字符串代码
  const codeContent = String(children).replace(/\n$/, "")

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(codeContent)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  // 不是多行代码块（没指定语言也没换行时通常作为 inline code，但此处我们作为 block 处理处理，或者回退）
  if (!match && !String(children).includes("\n")) {
    return (
      <code className={className} style={{ fontFamily: "var(--font-article-jetbrains)" }} {...props}>
        {children}
      </code>
    )
  }

  return (
    <div className="group relative">
      {/* 顶部悬浮工具条：主题切换和复制 */}
      <div className={`absolute right-3 top-3 z-20 flex items-center gap-2 transition-opacity ${isThemeMenuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}>

        {/* 主题下拉选择 */}
        <div className="relative">
          <button
            onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
            className="flex h-7 w-7 items-center justify-center rounded-md bg-[#5C5147]/80 text-[#F3EBE1] backdrop-blur hover:bg-[#C4956A] transition-colors"
            title="选择主题"
          >
            <Palette className="h-3.5 w-3.5" />
          </button>

          {isThemeMenuOpen && (
            <div className="absolute right-0 top-9 w-32 flex flex-col gap-0.5 rounded-lg bg-[#F3EBE1] p-1.5 shadow-xl border border-[#E8DDD0]">
              {(Object.keys(THEMES) as ThemeKey[]).map((theme) => (
                <button
                  key={theme}
                  onClick={() => handleThemeChange(theme)}
                  className={
                    "w-full rounded-md px-3 py-1.5 text-left text-[13px] font-medium transition-colors " +
                    (currentTheme === theme
                      ? "bg-[#C4956A] text-white"
                      : "text-[#5C5147] hover:bg-[#E8DDD0]")
                  }
                >
                  {theme}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 复制按钮 */}
        <button
          onClick={copyToClipboard}
          className="flex h-7 w-7 items-center justify-center rounded-md bg-[#5C5147]/80 text-[#F3EBE1] backdrop-blur hover:bg-[#C4956A] transition-colors"
          title="复制代码"
        >
          {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>

      <div className="overflow-hidden rounded-xl bg-[#1E1E1E]">
        <SyntaxHighlighter
          {...props}
          style={{
            ...THEMES[currentTheme],
            'pre[class*="language-"]': {
              ...THEMES[currentTheme]['pre[class*="language-"]'],
              background: "transparent",
              backgroundColor: "transparent",
              margin: 0,
              padding: "1rem",
              fontSize: "13px",
              lineHeight: "1.6",
              fontFamily: "var(--font-article-jetbrains)",
            },
            'code[class*="language-"]': {
              ...THEMES[currentTheme]['code[class*="language-"]'],
              background: "transparent",
              backgroundColor: "transparent",
              fontFamily: "var(--font-article-jetbrains)",
            }
          }}
          language={language}
          PreTag="div"
        >
          {codeContent}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
