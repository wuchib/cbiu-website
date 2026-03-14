import { notFound } from "next/navigation"
import { ArticleDetail } from "@/components/articles/article-detail"
import { ArticleStoreUpdater } from "@/components/articles/article-store-updater"
import { prisma } from "@/lib/prisma"

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  try {
    const articles = await prisma.article.findMany({
      where: { published: true },
      select: { slug: true }
    })
    return articles.map((article) => ({
      slug: article.slug,
    }))
  } catch (error) {
    // If DB is seemingly unavailable (e.g. during build), return empty
    // to skip static generation for now.
    console.log('Skipping static params generation due to DB unavailable')
    return []
  }
}

export default async function ArticlePage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const article = await prisma.article.findUnique({
    where: {
      slug: params.slug,
      published: true
    }
  })

  if (!article) {
    notFound()
  }

  // 查询上一篇（比当前更新的文章）
  const prevArticle = await prisma.article.findFirst({
    where: {
      published: true,
      publishedAt: { gt: article.publishedAt ?? undefined }
    },
    orderBy: { publishedAt: 'asc' },
    select: { slug: true, title: true }
  })

  // 查询下一篇（比当前更旧的文章）
  const nextArticle = await prisma.article.findFirst({
    where: {
      published: true,
      publishedAt: { lt: article.publishedAt ?? undefined }
    },
    orderBy: { publishedAt: 'desc' },
    select: { slug: true, title: true }
  })

  // Map to the shape expected by ArticleDetail (compatible with Article interface)
  const formattedArticle = {
    ...article,
    date: article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("en-US", {
      year: 'numeric', month: 'long', day: 'numeric'
    }) : '',
    tags: [], // TODO: Fetch tags
    content: article.content || '',
    description: article.description || '',
    cover: article.coverImage || undefined
  }

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] w-full max-w-none">
      {/* 实时同步文章内容给全局 DynamicIsland 中的阅读进度组件 */}
      <ArticleStoreUpdater content={article.content || ''} />

      {/* 文章内容 */}
      <div className="py-8">
        <ArticleDetail
          article={formattedArticle}
          articleId={article.id}
          prevArticle={prevArticle}
          nextArticle={nextArticle}
        />
      </div>

    </div>
  )
}
