import { notFound } from "next/navigation"
import { Icon } from "@iconify/react"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { ArrowLeft } from "lucide-react"
import { ArticleDetail } from "@/components/articles/article-detail"
import { prisma } from "@/lib/prisma"

export async function generateStaticParams() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    select: { slug: true }
  })
  return articles.map((article) => ({
    slug: article.slug,
  }))
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

  // Map to the shape expected by ArticleDetail (compatible with Article interface)
  const formattedArticle = {
    ...article,
    date: article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("en-US", {
      year: 'numeric', month: 'long', day: 'numeric'
    }) : '',
    tags: [], // TODO: Fetch tags
    content: article.content || '',
    description: article.description || '',
    cover: article.coverImage
  }

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)]">
      {/* Background Element - wrapped to prevent scrollbar */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute right-0 top-0 z-0 opacity-5 dark:opacity-[0.02]">
          <Icon icon="ph:article-medium-thin" width={600} height={600} />
        </div>
      </div>

      <div className="container relative mx-auto max-w-5xl px-4 py-24 z-10">
        <Link href="/articles" className="inline-block mb-8">
          <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-primary transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Articles
          </Button>
        </Link>

        {/* @ts-ignore */}
        <ArticleDetail article={formattedArticle} />
      </div>
    </div>
  )
}
