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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/articles" className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
          <Icon icon="ph:arrow-left" className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight leading-none">Edit Article</h2>
          <p className="text-xs text-muted-foreground font-mono">{article.slug}</p>
        </div>
      </div>

      <ArticleForm article={article} />
    </div>
  )
}
