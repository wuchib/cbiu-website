'use client'

import { Icon } from "@iconify/react"
import { useTranslations } from "next-intl"

interface VisitorStatsCardsProps {
  today: number
  total: number
}

export function VisitorStatsCards({ today, total }: VisitorStatsCardsProps) {
  const t = useTranslations('Admin.visitorStats')

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-primary/10 p-3">
            <Icon icon="ph:calendar-check" className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t('today')}</p>
            <p className="text-2xl font-bold">{today.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-green-500/10 p-3">
            <Icon icon="ph:users" className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t('total')}</p>
            <p className="text-2xl font-bold">{total.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
