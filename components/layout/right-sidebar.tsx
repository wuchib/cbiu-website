"use client"

import * as React from "react"
import { Icon } from "@iconify/react"
import { usePathname } from "@/i18n/routing"

export function RightSidebar() {
  const pathname = usePathname()

  // 文章详情页不显示右侧边栏
  const isArticleDetail = pathname?.match(/^\/articles\/.+/)
  if (isArticleDetail) return null
  const tags = [
    { name: "分享", count: 207 },
    { name: "流水账", count: 94 },
    { name: "节气", count: 82 },
    { name: "摄影", count: 62 },
    { name: "设计", count: 48 },
    { name: "工具箱", count: 36 },
    { name: "生活", count: 35 },
    { name: "观点", count: 25 },
    { name: "编码", count: 24 },
    { name: "游记", count: 15 },
    { name: "周刊", count: 14 },
    { name: "自省", count: 14 },
    { name: "散装日常", count: 8 },
    { name: "徒步", count: 7 },
  ]

  // Dummy logic for rendering a fake heatmap
  const generateHeatmapCols = () => {
    const cols = []
    const colors = ["bg-[#E8DDD0]", "bg-[#D4A574]", "bg-[#C4956A]", "bg-[#B5844E]"]

    for (let c = 0; c < 13; c++) {
      const rows = []
      for (let r = 0; r < 4; r++) {
        // Deterministic pseudo-random to prevent hydration mismatch
        const val = (c * 17 + r * 31) % 100
        const colorIndex = val > 70 ? (val % 3) + 1 : 0
        rows.push(
          <div key={`${c}-${r}`} className={`h-3 w-3 rounded-sm ${colors[colorIndex]}`} />
        )
      }
      cols.push(<div key={c} className="flex flex-col gap-[3px]">{rows}</div>)
    }
    return cols
  }

  return (
    <aside className="sticky top-0 z-40 hidden h-screen w-[240px] shrink-0 flex-col gap-8 bg-[#F3EBE1] p-6 lg:flex overflow-y-auto">
      {/* Heatmap Section */}
      <div className="flex flex-col gap-3">
        <span className="font-bold text-[15px] text-[#2C2520]">热力图</span>
        <div className="flex items-center gap-1 text-[12px] text-[#8B7E74]">
          <Icon icon="lucide:pen-line" className="h-3 w-3" />
          <span>写作伙伴，博主已记录 836 篇文章!</span>
        </div>
        <div className="flex gap-[3px]">
          {generateHeatmapCols()}
        </div>
      </div>

      {/* Tags Cloud Section */}
      <div className="flex flex-col gap-3">
        <span className="font-bold text-[15px] text-[#2C2520]">Tags</span>
        <div className="flex flex-col gap-1.5">
          {tags.map((tag) => (
            <div key={tag.name} className="flex items-center justify-between group cursor-pointer hover:bg-[#E8DDD0] -mx-2 px-2 py-1 rounded-md transition-colors">
              <span className="text-[14px] text-[#C4956A]">#{tag.name}</span>
              <span className="text-[14px] text-[#8B7E74]">{tag.count}</span>
            </div>
          ))}
          <div className="flex items-center justify-between cursor-pointer group mt-2 -mx-2 px-2 py-1 rounded-md hover:bg-[#E8DDD0] transition-colors">
            <span className="text-[14px] text-[#C4956A]">#More..</span>
            <Icon icon="lucide:arrow-right" className="h-3 w-3 text-[#C4956A]" />
          </div>
        </div>
      </div>

      {/* Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="mt-auto py-2 flex justify-center hover:bg-[#E8DDD0] rounded-md transition-colors"
      >
        <span className="font-bold text-[13px] text-[#C4956A]">TOP</span>
      </button>
    </aside>
  )
}
