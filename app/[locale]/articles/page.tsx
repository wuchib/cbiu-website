import { ArticleList } from "@/components/articles/article-list"
import { prisma } from "@/lib/prisma"

export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      publishedAt: true,
      coverImage: true,
    }
  })

  const formattedArticles = articles.map(article => ({
    ...article,
    date: article.publishedAt ? article.publishedAt.toISOString() : new Date().toISOString(),
    cover: article.coverImage,
    tags: [], // Tags not yet implemented in UI/DB relation fully for list
  }))

  // @ts-ignore
  return <ArticleList articles={formattedArticles} />
}
