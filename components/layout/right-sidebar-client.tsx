"use client"

import { Icon } from "@iconify/react"
import { usePathname } from "@/i18n/routing"
import type { HeatmapCell } from "@/lib/article-heatmap"

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

const HEATMAP_COLORS = [
  "bg-[color:color-mix(in_srgb,var(--sidebar-accent)_92%,transparent)]",
  "bg-[color:color-mix(in_srgb,var(--color-coffee-600)_55%,var(--sidebar-accent)_45%)]",
  "bg-[var(--sidebar-primary)]",
  "bg-[var(--color-coffee-500)]",
] as const
const HEATMAP_ROW_LABELS = ["一", "", "三", "", "五", "", "日"]

type SidebarClientProps = {
  totalPublishedArticles: number
  weeks: HeatmapCell[][]
}

function Heatmap({ mobile = false, weeks }: { mobile?: boolean; weeks: HeatmapCell[][] }) {
  const cellClass = mobile ? "h-[32px] w-[32px] rounded-[8px]" : "h-[15px] w-[15px] rounded-[4px]"
  const gapClass = mobile ? "gap-[8px]" : "gap-[5px]"
  const labelClass = mobile ? "h-[32px] text-[15px]" : "h-[15px] text-[12px]"

  return (
    <div className="flex items-start gap-3">
      <div className={`grid grid-cols-9 ${gapClass} shrink-0`} aria-label="最近 63 天文章发布热力图">
        {weeks.flatMap((week) =>
          week.map((cell) => (
            <div
              key={cell.date}
              title={`${cell.date} 发布 ${cell.count} 篇`}
              aria-label={`${cell.date} 发布 ${cell.count} 篇`}
              className={`${cellClass} ${HEATMAP_COLORS[cell.level]}`}
            />
          ))
        )}
      </div>

      <div className={`grid grid-rows-7 ${gapClass} pt-[1px]`} aria-hidden="true">
        {HEATMAP_ROW_LABELS.map((label, index) => (
          <div
            key={`${label}-${index}`}
            className={`${labelClass} flex items-center font-medium tracking-[0.02em] text-[color:color-mix(in_srgb,var(--sidebar-foreground)_75%,transparent)]`}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}

function SidebarContent({
  mobile = false,
  totalPublishedArticles,
  weeks,
}: SidebarClientProps & { mobile?: boolean }) {
  return (
    <div className={mobile ? "flex flex-col gap-8 rounded-2xl border border-[var(--sidebar-border)] bg-[color:color-mix(in_srgb,var(--sidebar)_88%,var(--foreground)_12%)] p-5" : "flex flex-col gap-8"}>
      <div className="flex flex-col gap-4">
        <span className="text-[12px] leading-none text-[color:color-mix(in_srgb,var(--sidebar-foreground)_75%,transparent)]">最近 9 周共发布 {totalPublishedArticles} 篇文章</span>
        <Heatmap mobile={mobile} weeks={weeks} />
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-[15px] font-bold text-[var(--foreground)]">Tags</span>
        <div className="flex flex-col gap-1.5">
          {tags.map((tag) => (
            <div
              key={tag.name}
              className="group -mx-2 flex cursor-pointer items-center justify-between rounded-md px-2 py-1 transition-colors hover:bg-[var(--sidebar-accent)]"
            >
              <span className="text-[14px] text-[var(--sidebar-primary)]">#{tag.name}</span>
              <span className="text-[14px] text-[color:color-mix(in_srgb,var(--sidebar-foreground)_75%,transparent)]">{tag.count}</span>
            </div>
          ))}
          <div className="group mt-2 -mx-2 flex cursor-pointer items-center justify-between rounded-md px-2 py-1 transition-colors hover:bg-[var(--sidebar-accent)]">
            <span className="text-[14px] text-[var(--sidebar-primary)]">#More..</span>
            <Icon icon="lucide:arrow-right" className="h-3 w-3 text-[var(--sidebar-primary)]" />
          </div>
        </div>
      </div>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="mt-auto flex justify-center rounded-md py-2 transition-colors hover:bg-[var(--sidebar-accent)]"
      >
        <span className="text-[13px] font-bold text-[var(--sidebar-primary)]">TOP</span>
      </button>
    </div>
  )
}

export function MobileRightSidebarContentClient(props: SidebarClientProps) {
  const pathname = usePathname()
  const isArticleDetail = pathname?.match(/^\/articles\/.+/)

  if (isArticleDetail) return null

  return <SidebarContent mobile {...props} />
}

export function RightSidebarClient(props: SidebarClientProps) {
  const pathname = usePathname()
  const isArticleDetail = pathname?.match(/^\/articles\/.+/)

  if (isArticleDetail) return null

  return (
    <aside className="sticky top-0 z-40 hidden h-screen w-[240px] shrink-0 overflow-y-auto border-l border-[var(--sidebar-border)] bg-[var(--sidebar)] p-6 lg:flex">
      <SidebarContent {...props} />
    </aside>
  )
}
