import { prisma } from "@/lib/prisma"
import { getTranslations } from "next-intl/server"
import { cookies } from "next/headers"
import ArticleDashboard from "@/components/admin/articles/article-dashboard"

export const dynamic = 'force-dynamic'

export default async function ArticlesAdminPage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';

  const [articles, categories] = await Promise.all([
    prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: true
      }
    }),
    prisma.articleCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { articles: true }
        }
      }
    })
  ])

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <ArticleDashboard articles={articles} categories={categories} />
    </div>
  )
}
