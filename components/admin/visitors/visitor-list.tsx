'use client'

import { useTranslations } from "next-intl"
import { useRouter, useSearchParams } from "next/navigation"
import { Icon } from "@iconify/react"
import { format } from "date-fns"

interface Visitor {
  id: string
  path: string
  ip: string | null
  userAgent: string | null
  referer: string | null
  country: string | null
  createdAt: Date
}

interface VisitorListProps {
  visitors: Visitor[]
  currentPage: number
  totalPages: number
  total: number
}

export function VisitorList({ visitors, currentPage, totalPages, total }: VisitorListProps) {
  const t = useTranslations('Admin.visitorStats')
  const router = useRouter()
  const searchParams = useSearchParams()

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`/admin/visitors?${params.toString()}`)
  }

  // 简化 User Agent 显示
  const simplifyUserAgent = (ua: string | null) => {
    if (!ua) return '-'
    if (ua.includes('Chrome')) return 'Chrome'
    if (ua.includes('Firefox')) return 'Firefox'
    if (ua.includes('Safari')) return 'Safari'
    if (ua.includes('Edge')) return 'Edge'
    if (ua.includes('bot') || ua.includes('Bot')) return 'Bot'
    return 'Other'
  }

  // 简化路径显示
  const simplifyPath = (path: string) => {
    if (path.length > 40) {
      return path.substring(0, 37) + '...'
    }
    return path
  }

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="p-6 border-b">
        <h2 className="font-semibold">{t('recentVisits')}</h2>
        <p className="text-sm text-muted-foreground">
          {t('totalRecords', { count: total })}
        </p>
      </div>

      {visitors.length === 0 ? (
        <div className="p-12 text-center text-muted-foreground">
          <Icon icon="ph:users-three" className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <p>{t('noData')}</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t('time')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t('path')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t('ip')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t('userAgent')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t('referer')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {visitors.map((visitor) => (
                  <tr key={visitor.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {format(new Date(visitor.createdAt), 'MM-dd HH:mm:ss')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="font-mono text-xs bg-muted px-2 py-1 rounded" title={visitor.path}>
                        {simplifyPath(visitor.path)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {visitor.ip || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="inline-flex items-center gap-1">
                        <Icon icon="ph:browser" className="h-4 w-4" />
                        {simplifyUserAgent(visitor.userAgent)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground max-w-[200px] truncate" title={visitor.referer || ''}>
                      {visitor.referer || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <p className="text-sm text-muted-foreground">
                {t('page')} {currentPage} / {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon icon="ph:caret-left" className="h-4 w-4" />
                  {t('prev')}
                </button>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('next')}
                  <Icon icon="ph:caret-right" className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
