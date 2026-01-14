import { prisma } from "@/lib/prisma"
import { Icon } from "@iconify/react"

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const [articleCount, projectCount, shareCount] = await Promise.all([
    prisma.article.count(),
    prisma.project.count(),
    prisma.shareResource.count(),
  ])

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Total Articles" value={articleCount} icon="ph:article-duotone" color="text-blue-500" />
        <StatCard title="Projects" value={projectCount} icon="ph:projector-screen-duotone" color="text-purple-500" />
        <StatCard title="Share Resources" value={shareCount} icon="ph:share-network-duotone" color="text-orange-500" />
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
        <h3 className="font-semibold leading-none tracking-tight mb-4">Quick Actions</h3>
        <div className="grid gap-4 md:grid-cols-4">
          {/* Add buttons here later */}
          <div className="p-4 border rounded-lg bg-muted/20 text-center text-sm text-muted-foreground">
            Manage Content from Sidebar
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, color }: { title: string, value: number, icon: string, color: string }) {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex items-center justify-between space-y-0">
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="text-2xl font-bold">{value}</div>
      </div>
      <div className={`p-3 rounded-full bg-muted/30 ${color}`}>
        <Icon icon={icon} className="w-6 h-6" />
      </div>
    </div>
  )
}
