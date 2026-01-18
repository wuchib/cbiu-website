import { prisma } from "@/lib/prisma"
import { getTranslations } from "next-intl/server"
import { cookies } from "next/headers"
import ShareDashboard from "@/components/admin/share/share-dashboard"

export const dynamic = 'force-dynamic'

export default async function ShareAdminPage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  // Ensure we await translations if needed, though client component handles most.
  // Actually, ShareDashboard uses useTranslations, so we just need to ensure NextIntlProvider is up (which Layout does).

  const [resources, categories] = await Promise.all([
    prisma.shareResource.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.shareCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { resources: true }
        }
      }
    })
  ])

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <ShareDashboard resources={resources} categories={categories} />
    </div>
  )
}
