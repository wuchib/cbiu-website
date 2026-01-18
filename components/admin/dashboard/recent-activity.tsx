"use client"

import Link from "next/link"
import { Icon } from "@iconify/react"
import { formatDistanceToNow } from "date-fns"
import { useTranslations } from "next-intl"

export type ActivityType = "article" | "project" | "resource"

export interface ActivityItem {
  id: string
  type: ActivityType
  title: string
  status?: string
  date: Date
  href: string
}

interface RecentActivityProps {
  activities: ActivityItem[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const t = useTranslations('Admin.dashboard.recentActivity')
  const tList = useTranslations('Admin.list')

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold leading-none tracking-tight">{t('title')}</h3>
        <Link href="/admin/articles" className="text-sm text-muted-foreground hover:text-primary transition-colors">
          {t('viewAll')}
        </Link>
      </div>

      <div className="space-y-6">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <Icon icon="ph:clock-duotone" className="w-12 h-12 mb-2 opacity-50" />
            <p>{t('noActivity')}</p>
          </div>
        ) : (
          activities.map((item) => (
            <div key={`${item.type}-${item.id}`} className="flex items-start gap-4 group">
              <div className={`mt-1 flex h-9 w-9 items-center justify-center rounded-full border border-border/50 bg-background shadow-sm transition-colors group-hover:border-primary/50`}>
                <Icon
                  icon={getActivityIcon(item.type)}
                  className={`h-4 w-4 ${getActivityColor(item.type)}`}
                />
              </div>
              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium leading-none truncate">{item.title}</p>
                  <span className="text-xs text-muted-foreground tabular-nums whitespace-nowrap shrink-0">
                    {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="capitalize">{t(`type.${item.type}`)}</span>
                  {item.status && (
                    <>
                      <span>•</span>
                      <span className={item.status === "published" ? "text-green-500" : "text-yellow-500"}>
                        {tList(item.status)}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <Link
                href={item.href}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-muted rounded-md"
              >
                <Icon icon="ph:pencil-simple" className="w-4 h-4 text-muted-foreground" />
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function getActivityIcon(type: ActivityType) {
  switch (type) {
    case "article": return "ph:article-duotone"
    case "project": return "ph:projector-screen-duotone"
    case "resource": return "ph:share-network-duotone"
  }
}

function getActivityColor(type: ActivityType) {
  switch (type) {
    case "article": return "text-blue-500"
    case "project": return "text-purple-500"
    case "resource": return "text-orange-500"
  }
}
