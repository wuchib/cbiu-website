import { getVisitors, getVisitorStats } from "@/actions/visitors"
import { VisitorList } from "@/components/admin/visitors/visitor-list"
import { VisitorStatsCards } from "@/components/admin/visitors/visitor-stats"
import { getTranslations } from "next-intl/server"
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function VisitorsPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const page = parseInt(params.page || '1', 10)

  const cookieStore = await cookies()
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en'
  const t = await getTranslations({ locale, namespace: 'Admin' })

  const [visitorsData, stats] = await Promise.all([
    getVisitors(page, 20),
    getVisitorStats()
  ])

  return (
    <div className="container mx-auto p-8 max-w-7xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">{t('visitors')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('visitorStats.subtitle')}
        </p>
      </div>

      <VisitorStatsCards
        today={stats.today}
        total={stats.total}
      />

      <VisitorList
        visitors={visitorsData.visitors}
        currentPage={visitorsData.page}
        totalPages={visitorsData.totalPages}
        total={visitorsData.total}
      />
    </div>
  )
}
