"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { List } from "lucide-react"
import { slugify } from "@/lib/slugify"

interface ReadingProgressProps {
  /** 文章内容，用于计算字数和预估阅读时间 */
  content: string
}

/**
 * 环状阅读进度 + 预估阅读时间 + 目录 Popover
 */
export function ReadingProgress({ content }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0)
  const [tocOpen, setTocOpen] = useState(false)
  const tocRef = useRef<HTMLDivElement>(null)

  // 从 content 提取标题
  const headings = useMemo(() => {
    const lines = content.split("\n")
    const extracted: { id: string; text: string; level: number }[] = []
    const textOccurrences = new Map<string, number>()
    let inCodeBlock = false

    for (const line of lines) {
      if (line.trim().startsWith("```")) {
        inCodeBlock = !inCodeBlock
        continue
      }
      if (inCodeBlock) continue

      const match = line.trim().match(/^(#{1,3})\s+(.+)$/)
      if (match) {
        const level = match[1].length
        const text = match[2].trim()
        const baseId = slugify(text)
        const count = textOccurrences.get(text) || 0
        textOccurrences.set(text, count + 1)
        const id = count > 0 ? `${baseId}-${count}` : baseId
        extracted.push({ id, text, level })
      }
    }
    return extracted
  }, [content])

  // 根据字数估算阅读时间
  const estimatedMinutes = useMemo(() => {
    const chineseChars = (content.match(/[\u4e00-\u9fff]/g) || []).length
    const englishWords = content
      .replace(/[\u4e00-\u9fff]/g, "")
      .split(/\s+/)
      .filter(Boolean).length
    const minutes = Math.ceil(chineseChars / 400 + englishWords / 200)
    return Math.max(1, minutes)
  }, [content])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight <= 0) {
        setProgress(0)
        return
      }
      const pct = Math.min(100, Math.round((scrollTop / docHeight) * 100))
      setProgress(pct)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // 点击外部关闭 Popover
  useEffect(() => {
    if (!tocOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (tocRef.current && !tocRef.current.contains(e.target as Node)) {
        setTocOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [tocOpen])

  // 环形进度 SVG 参数
  const size = 16
  const strokeWidth = 3
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="flex items-center gap-3">
      {/* 预估阅读时间 */}
      <span className="text-[12px] text-[#8B7E74] whitespace-nowrap leading-none">
        阅读时间：约 {estimatedMinutes} 分钟
      </span>

      {/* 环状进度 */}
      <div className="flex items-center justify-center">
        <svg
          width={size}
          height={size}
          className="-rotate-90"
          aria-label={`阅读进度 ${progress}%`}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E8DDD0"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#C4956A"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-[stroke-dashoffset] duration-150 ease-out"
          />
        </svg>
      </div>

      {/* 目录按钮 + Popover */}
      {headings.length > 0 && (
        <div className="relative flex items-center" ref={tocRef}>
          <button
            onClick={() => setTocOpen(!tocOpen)}
            className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-[#E8DDD0] transition-colors text-[#8B7E74] hover:text-[#5C5147]"
            aria-label="目录"
            title="目录"
          >
            <List className="h-3.5 w-3.5" />
          </button>

          {/* Popover */}
          {tocOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 max-h-80 overflow-y-auto rounded-lg border border-[#E8DDD0] bg-[#FAF5EF] shadow-lg p-3 z-50">
              <p className="text-[12px] font-semibold text-[#5C5147] mb-2">目录</p>
              <ul className="space-y-0.5">
                {headings.map((heading) => (
                  <li key={heading.id}>
                    <a
                      href={`#${heading.id}`}
                      style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
                      className="block text-[12px] py-1.5 px-2 rounded-md text-[#5C5147] hover:bg-[#E8DDD0] hover:text-[#2C2520] transition-colors line-clamp-1"
                      onClick={(e) => {
                        e.preventDefault()
                        document.getElementById(heading.id)?.scrollIntoView({
                          behavior: "smooth",
                        })
                        setTocOpen(false)
                      }}
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
