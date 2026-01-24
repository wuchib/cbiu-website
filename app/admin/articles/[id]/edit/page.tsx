import ArticleForm from "@/components/admin/article-form"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const { id } = params

  const [article, categories] = await Promise.all([
    prisma.article.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        description: true,
        coverImage: true,
        published: true,
        categoryId: true,
        tags: {
          select: {
            tag: {
              select: {
                name: true
              }
            }
          }
        }
      }
    }),
    prisma.articleCategory.findMany({
      orderBy: { sortOrder: 'asc' }
    })
  ])

  if (!article) notFound()

  // Transform tags to simple string array
  const articleWithTags = {
    ...article,
    tags: article.tags.map(t => t.tag.name)
  }

  return <ArticleForm article={articleWithTags} categories={categories} />
}
