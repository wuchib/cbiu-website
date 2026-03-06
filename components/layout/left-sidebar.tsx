"use client"

import * as React from "react"
import { Link, usePathname } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react"
import { useTranslations } from "next-intl"

import { SearchCommand } from "@/components/search-command"
import { LanguageToggle } from "@/components/language-toggle"
import { ThemeToggle } from "@/components/layout/theme-toggle"

export function LeftSidebar() {
  const pathname = usePathname()
  const t = useTranslations("Navigation")
  const [searchOpen, setSearchOpen] = React.useState(false)

  const items = React.useMemo(() => [
    { title: t("home"), href: "/", icon: "lucide:home" },
    { title: t("articles"), href: "/articles", icon: "lucide:pen-line" },
    { title: t("projects"), href: "/projects", icon: "lucide:folder-open" },
    { title: t("share"), href: "/share", icon: "lucide:share-2" },
    { title: t("todo"), href: "/todo", icon: "lucide:check-square" },
    { title: t("friends"), href: "/friends", icon: "lucide:users" },
  ], [t])

  return (
    <aside className="sticky top-0 z-40 hidden h-screen w-[220px] shrink-0 flex-col gap-6 bg-[#F3EBE1] p-6 lg:flex overflow-y-auto">
      {/* Logo Area */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#D4A574] to-[#C4956A] text-white">
          <Icon icon="lucide:sparkles" className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-[#2C2520] text-sm">Cbiu的小站 ✨</span>
          <span className="text-[10px] text-[#8B7E74]">记录生活与技术的点滴</span>
        </div>
      </div>

      {/* Search Bar */}
      <button
        onClick={() => setSearchOpen(true)}
        className="flex h-9 w-full items-center gap-2 rounded-lg bg-[#EDE5DB] px-3 text-[#A89888] hover:bg-[#E8DDD0] transition-colors"
      >
        <Icon icon="lucide:search" className="h-3.5 w-3.5" />
        <span className="text-[13px]">Search</span>
      </button>

      {/* Main Navigation */}
      <div className="flex flex-col gap-1">
        <span className="mb-2 text-[11px] font-semibold text-[#8B7E74]">路线牌</span>
        {items.map((item) => {
          const isActive = pathname === item.href || (pathname !== "/" && pathname?.startsWith(item.href) && item.href !== "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-8 items-center gap-3 rounded-md px-2 text-[13px] transition-colors",
                isActive
                  ? "bg-[#E8DDD0] text-[#2C2520] font-semibold"
                  : "text-[#5C5147] hover:bg-[#E8DDD0] hover:text-[#2C2520]"
              )}
            >
              <Icon
                icon={item.icon}
                className={cn("h-3.5 w-3.5", isActive ? "text-[#C4956A]" : "text-[#8B7E74]")}
              />
              {item.title}
            </Link>
          )
        })}
      </div>

      <div className="mt-auto flex flex-col gap-1 text-[11px] text-[#A89888]">
        <span className="mb-1 font-semibold text-[#8B7E74]">其他</span>
        <a href="#" className="flex gap-2 text-[#5C5147] hover:text-[#C4956A]">Github / Rss</a>
        <span className="text-[#8B7E74]">Power by Next.js</span>
        <span className="text-[#8B7E74]">CC BY-NC-ND 4.0</span>
        <span>本站由Vercel提供服务</span>
      </div>

      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
    </aside>
  )
}
