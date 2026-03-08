import { notFound } from "next/navigation"
import { Link } from "@/i18n/routing"
import { ArrowLeft } from "lucide-react"
import { ArticleDetail } from "@/components/articles/article-detail"
import { ReadingProgress } from "@/components/articles/reading-progress"
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
      {/* 粘性返回按钮 + 阅读进度 */}
      <div className="sticky top-0 z-30 bg-[#F3EBE1]/80 backdrop-blur-sm py-3 -mx-4 px-4 md:-mx-8 md:px-8">
        <div className="flex items-center justify-between">
          <Link href="/articles" className="inline-flex items-center gap-2 text-[13px] text-[#8B7E74] hover:text-[#C4956A] transition-colors">
            <ArrowLeft className="h-4 w-4" />
            返回文章列表
          </Link>
          <ReadingProgress content={article.content || ''} />
        </div>
      </div>

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
