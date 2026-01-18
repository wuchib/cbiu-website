"use client"

import Link from "next/link"
import { Icon } from "@iconify/react"
import { useTranslations } from "next-intl"

export function QuickActions() {
  const t = useTranslations('Admin.dashboard.quickActions')
  const tActions = useTranslations('Admin.actions') // For "new" etc if needed, or just use dashboard keys

  const actions = [
    {
      title: t('newArticle'),
      href: "/admin/articles/new",
      icon: "ph:pencil-duotone",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: t('newProject'),
      href: "/admin/projects/new",
      icon: "ph:projector-screen-duotone",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
    {
      title: t('addResource'),
      href: "/admin/share/new",
      icon: "ph:share-network-duotone",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
    },
    {
      title: t('globalSettings'),
      href: "/admin/settings",
      icon: "ph:gear-duotone",
      color: "text-slate-500",
      bgColor: "bg-slate-500/10",
      borderColor: "border-slate-500/20",
    },
  ]

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <h3 className="mb-4 font-semibold leading-none tracking-tight">{t('title')}</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`group flex items-center justify-between rounded-xl border ${action.borderColor} bg-background p-4 transition-all hover:bg-muted/50 hover:shadow-sm`}
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.bgColor} ${action.color} transition-transform group-hover:scale-110`}>
                <Icon icon={action.icon} className="h-5 w-5" />
              </div>
              <span className="font-medium text-sm">{action.title}</span>
            </div>
            <Icon icon="ph:caret-right" className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        ))}
      </div>
    </div>
  )
}
