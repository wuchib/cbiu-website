import ArticleForm from "@/components/admin/article-form"
import Link from "next/link"
import { Icon } from "@iconify/react"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const articleData = await prisma.article.findUnique({
    where: { id },
    include: {
      tags: {
        include: {
          tag: true
        }
      }
    }
  })

  // Flatten tags for the form
  const article = articleData ? {
    ...articleData,
    tags: articleData.tags.map(t => t.tag.name)
  } : null

  if (!article) {
    notFound()
  }

  return <ArticleForm article={article} />
}
