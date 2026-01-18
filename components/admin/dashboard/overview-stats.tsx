"use client"

import { Icon } from "@iconify/react"
import { useTranslations } from "next-intl"

interface OverviewStatsProps {
  articleCount: number
  projectCount: number
  shareCount: number
}

export function OverviewStats({ articleCount, projectCount, shareCount }: OverviewStatsProps) {
  const t = useTranslations('Admin.dashboard.overview')

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <StatCard
        title={t('totalArticles')}
        value={articleCount}
        icon="ph:article-duotone"
        color="text-blue-500"
        bgGradient="from-blue-500/10 to-blue-500/5"
        borderColor="border-blue-500/20"
      />
      <StatCard
        title={t('projects')}
        value={projectCount}
        icon="ph:projector-screen-duotone"
        color="text-purple-500"
        bgGradient="from-purple-500/10 to-purple-500/5"
        borderColor="border-purple-500/20"
      />
      <StatCard
        title={t('shareResources')}
        value={shareCount}
        icon="ph:share-network-duotone"
        color="text-orange-500"
        bgGradient="from-orange-500/10 to-orange-500/5"
        borderColor="border-orange-500/20"
      />
    </div>
  )
}

interface StatCardProps {
  title: string
  value: number
  icon: string
  color: string
  bgGradient: string
  borderColor: string
}

function StatCard({ title, value, icon, color, bgGradient, borderColor }: StatCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border ${borderColor} bg-gradient-to-br ${bgGradient} p-6 shadow-sm transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h4 className="text-3xl font-bold tracking-tight">{value}</h4>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-background/50 backdrop-blur-sm ${color}`}>
          <Icon icon={icon} className="h-6 w-6" />
        </div>
      </div>
      {/* Decorative circle */}
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${color} opacity-5 blur-2xl`} />
    </div>
  )
}
