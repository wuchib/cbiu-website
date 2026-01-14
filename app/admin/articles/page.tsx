import { prisma } from "@/lib/prisma"
import { Icon } from "@iconify/react"
import Link from "next/link"
import { deleteArticle, togglePublishArticle } from "@/actions/articles"
import { formatDate } from "@/lib/utils" // Assuming this exists or I might need to make a helper

export const dynamic = 'force-dynamic'

export default async function ArticlesAdminPage() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      published: true,
      createdAt: true,
      viewCount: true,
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Articles</h2>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          <Icon icon="ph:plus" className="mr-2 h-4 w-4" />
          Write Article
        </Link>
      </div>

      <div className="rounded-md border bg-card">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm text-left">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[50%]">Title</th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Views</th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Created</th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {articles.map((article) => (
                <tr key={article.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle">
                    <div className="font-medium">{article.title}</div>
                    <div className="text-xs text-muted-foreground font-mono">/{article.slug}</div>
                  </td>
                  <td className="p-4 align-middle">
                    <form action={togglePublishArticle.bind(null, article.id, article.published)}>
                      <button className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors
                            ${article.published ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'}`}>
                        {article.published ? 'Published' : 'Draft'}
                      </button>
                    </form>
                  </td>
                  <td className="p-4 align-middle text-muted-foreground">
                    {article.viewCount}
                  </td>
                  <td className="p-4 align-middle text-muted-foreground">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 align-middle text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/articles/${article.id}/edit`} className="p-2 hover:bg-muted rounded-md transition-colors">
                        <Icon icon="ph:pencil-simple" className="w-4 h-4 text-muted-foreground" />
                      </Link>
                      <form action={async () => {
                        'use server'
                        await deleteArticle(article.id)
                      }}>
                        <button className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors">
                          <Icon icon="ph:trash" className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {articles.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No articles found. Start writing!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
