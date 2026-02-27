import { prisma } from "@/lib/prisma"
import { getTranslations } from "next-intl/server"
import { cookies } from "next/headers"
import ArticleDashboard from "@/components/admin/articles/article-dashboard"

export const dynamic = 'force-dynamic'

export default async function ArticlesAdminPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || '1');
  const pageSize = 10;

  const totalArticles = await prisma.article.count();
  const totalPages = Math.ceil(totalArticles / pageSize);

  const [articles, categories] = await Promise.all([
    prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
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
      <ArticleDashboard articles={articles} categories={categories} totalPages={totalPages} currentPage={page} />
    </div>
  )
}
