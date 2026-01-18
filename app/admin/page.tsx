import { prisma } from "@/lib/prisma"
import { OverviewStats } from "@/components/admin/dashboard/overview-stats"
import { QuickActions } from "@/components/admin/dashboard/quick-actions"
import { WelcomeHeader } from "@/components/admin/dashboard/welcome-header"
import { RecentActivity, ActivityItem } from "@/components/admin/dashboard/recent-activity"

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const [
    articleCount,
    projectCount,
    shareCount,
    recentArticles,
    recentProjects,
    recentResources
  ] = await Promise.all([
    prisma.article.count(),
    prisma.project.count(),
    prisma.shareResource.count(),
    prisma.article.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: { id: true, title: true, published: true, updatedAt: true }
    }),
    prisma.project.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: { id: true, title: true, updatedAt: true }
    }),
    prisma.shareResource.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, title: true, createdAt: true }
    }),
  ])

  // Combine and format activities
  const activities: ActivityItem[] = [
    ...recentArticles.map(a => ({
      id: a.id,
      type: 'article' as const,
      title: a.title,
      status: a.published ? 'published' : 'draft',
      date: a.updatedAt,
      href: `/admin/articles/${a.id}/edit`
    })),
    ...recentProjects.map(p => ({
      id: p.id,
      type: 'project' as const,
      title: p.title,
      date: p.updatedAt,
      href: `/admin/projects/${p.id}/edit`
    })),
    ...recentResources.map(r => ({
      id: r.id,
      type: 'resource' as const,
      title: r.title,
      date: r.createdAt,
      href: `/admin/share/${r.id}/edit`
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 10)

  return (
    <div className="container mx-auto p-8 max-w-7xl space-y-8">
      <WelcomeHeader />

      <OverviewStats
        articleCount={articleCount}
        projectCount={projectCount}
        shareCount={shareCount}
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <QuickActions />
        </div>
        <div className="lg:row-span-2">
          <RecentActivity activities={activities} />
        </div>
      </div>
    </div>
  )
}
