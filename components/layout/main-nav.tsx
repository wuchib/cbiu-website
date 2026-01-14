"use client"

import * as React from "react"
import { Link, usePathname } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { ThemeCustomizer } from "@/components/theme-customizer"
import { LanguageToggle } from "@/components/language-toggle"
import { Icon } from "@iconify/react"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"

export function MainNav() {
  const pathname = usePathname()
  const t = useTranslations("Navigation")
  const [hovered, setHovered] = React.useState<string | null>(null)

  const items = [
    { title: t("home"), href: "/", icon: "ph:house-bold" },
    { title: t("articles"), href: "/articles", icon: "ph:read-cv-logo-bold" },
    { title: t("projects"), href: "/projects", icon: "ph:code-bold" },
    { title: t("share"), href: "/share", icon: "ph:share-network-bold" },
    { title: t("about"), href: "/about", icon: "ph:user-bold" },
  ]

  return (
    <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2">
      <nav className="flex items-center gap-1 rounded-full border border-white/20 bg-white/10 p-2 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-white/5 dark:border-white/10 dark:bg-black/10">

        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onMouseEnter={() => setHovered(item.href)}
            onMouseLeave={() => setHovered(null)}
            className={cn(
              "group relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
              pathname === item.href || (pathname !== "/" && pathname?.startsWith(item.href) && item.href !== "/")
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            {/* Animated Background Pill */}
            {(pathname === item.href || (pathname !== "/" && pathname?.startsWith(item.href) && item.href !== "/")) && (
              <motion.div
                layoutId="nav-pill"
                className="absolute inset-0 z-0 rounded-full bg-black/5 dark:bg-white/10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}

            <span className="relative z-10 flex items-center gap-2">
              <motion.div
                animate={{
                  scale: hovered === item.href ? 1.2 : 1,
                  rotate: hovered === item.href ? 10 : 0
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Icon icon={item.icon} className="h-4 w-4" />
              </motion.div>
              <span className="hidden sm:inline-block">
                {item.title}
              </span>
            </span>
          </Link>
        ))}

        <div className="mx-2 h-6 w-px bg-white/10" />

        <div className="flex items-center gap-1 pr-2">
          <ThemeCustomizer />
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </nav>
    </div>
  )
}
