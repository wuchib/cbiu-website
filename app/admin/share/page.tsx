import { prisma } from "@/lib/prisma"
import { getTranslations } from "next-intl/server"
import { cookies } from "next/headers"
import ShareDashboard from "@/components/admin/share/share-dashboard"

export const dynamic = 'force-dynamic'

export default async function ShareAdminPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || '1');
  const pageSize = 10;

  const totalResources = await prisma.shareResource.count();
  const totalPages = Math.ceil(totalResources / pageSize);

  const [resources, categories] = await Promise.all([
    prisma.shareResource.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
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
      <ShareDashboard resources={resources} categories={categories} totalPages={totalPages} currentPage={page} />
    </div>
  )
}
