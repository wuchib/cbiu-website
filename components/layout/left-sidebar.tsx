"use client"

import * as React from "react"
import { Link, usePathname } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react"
import { useTranslations } from "next-intl"
import { useTheme } from "next-themes"

import { SearchCommand } from "@/components/search-command"
import { AuthWidget } from "@/components/auth/auth-widget"

type LeftSidebarContentProps = {
  mobile?: boolean
  onNavigate?: () => void
}

const themeOptions = [
  { value: "light", label: "亮色", icon: "ph:sun-bold" },
  { value: "dark", label: "暗色", icon: "ph:moon-bold" },
  { value: "system", label: "系统", icon: "ph:desktop-bold" },
] as const

function ThemeSwitch() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const currentTheme = mounted ? (theme ?? "system") : "system"
  const currentIndex = themeOptions.findIndex((option) => option.value === currentTheme)
  const activeIndex = currentIndex === -1 ? 2 : currentIndex

  return (
    <div className="w-full rounded-lg border border-[var(--sidebar-border)] bg-[color:color-mix(in_srgb,var(--sidebar)_88%,var(--foreground)_12%)] p-1">
      <div className="relative grid grid-cols-3 gap-0.5">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 top-0 w-[calc((100%-0.25rem)/3)] rounded-md bg-[var(--sidebar-primary)] shadow-[0_6px_18px_rgba(0,0,0,0.12)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `translateX(calc(${activeIndex} * 100% + ${activeIndex} * 0.125rem))` }}
        />
        {themeOptions.map((option) => {
          const isActive = currentTheme === option.value
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setTheme(option.value)}
              className={cn(
                "relative z-10 flex h-8 items-center justify-center rounded-md transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                isActive
                  ? "text-[var(--sidebar-primary-foreground)]"
                  : "text-[color:color-mix(in_srgb,var(--sidebar-foreground)_85%,transparent)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"
              )}
              aria-pressed={isActive}
              title={option.label}
              aria-label={option.label}
            >
              <Icon
                icon={option.icon}
                className={cn(
                  "h-4 w-4 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  isActive ? "scale-110" : "scale-95"
                )}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function LeftSidebarContent({
  mobile = false,
  onNavigate,
}: LeftSidebarContentProps) {
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
    <div
      className={cn(
        "flex h-full flex-col gap-6 overflow-y-auto border-r border-[var(--sidebar-border)] bg-[var(--sidebar)] p-6",
        mobile ? "w-full" : "min-h-screen w-[220px]"
      )}
    >
      {/* Logo Area */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-coffee-600)] to-[var(--color-coffee-400)] text-white">
          <Icon icon="lucide:sparkles" className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-[16px] font-bold text-[var(--foreground)]">Cbiu的小站 ✨</span>
          <span className="text-[12px] text-[color:color-mix(in_srgb,var(--sidebar-foreground)_75%,transparent)]">记录生活与技术的点滴</span>
        </div>
      </div>

      {/* Search Bar */}
      <button
        onClick={() => setSearchOpen(true)}
        className="flex h-9 w-full items-center gap-2 rounded-lg bg-[var(--sidebar-accent)] px-3 text-[color:color-mix(in_srgb,var(--sidebar-foreground)_70%,transparent)] transition-colors hover:bg-[color:color-mix(in_srgb,var(--sidebar-accent)_88%,var(--foreground)_12%)]"
      >
        <Icon icon="lucide:search" className="h-3.5 w-3.5" />
        <span className="text-[15px]">Search</span>
      </button>

      {/* Main Navigation */}
      <div className="flex flex-col gap-1">
        {items.map((item) => {
          const isActive = pathname === item.href || (pathname !== "/" && pathname?.startsWith(item.href) && item.href !== "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex h-8 items-center gap-3 rounded-md px-2 text-[15px] transition-colors",
                isActive
                  ? "bg-[var(--sidebar-accent)] font-semibold text-[var(--foreground)]"
                  : "text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--foreground)]"
              )}
            >
              <Icon
                icon={item.icon}
                className={cn(
                  "h-3.5 w-3.5",
                  isActive ? "text-[var(--sidebar-primary)]" : "text-[color:color-mix(in_srgb,var(--sidebar-foreground)_70%,transparent)]"
                )}
              />
              {item.title}
            </Link>
          )
        })}
      </div>

      <div className="mt-auto flex flex-col gap-3 text-[13px] text-[color:color-mix(in_srgb,var(--sidebar-foreground)_70%,transparent)]">
        <ThemeSwitch />
        <AuthWidget />
        <span className="mt-1 text-center text-[color:color-mix(in_srgb,var(--sidebar-foreground)_75%,transparent)]">© 2026 Cbiu. 版权所有</span>
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className="text-center text-[color:color-mix(in_srgb,var(--sidebar-foreground)_75%,transparent)] transition-colors hover:text-[var(--sidebar-primary)]">粤ICP备2026011005号-1</a>
      </div>

      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  )
}

export function LeftSidebar() {
  return (
    <aside className="sticky top-0 z-40 hidden h-screen w-[220px] shrink-0 lg:flex">
      <LeftSidebarContent />
    </aside>
  )
}
