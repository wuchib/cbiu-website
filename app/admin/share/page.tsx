import { prisma } from "@/lib/prisma"
import { Icon } from "@iconify/react"
import Link from "next/link"
import { deleteShareResource } from "@/actions/share"
import { getTranslations } from "next-intl/server"
import { cookies } from "next/headers"

export const dynamic = 'force-dynamic'

export default async function ShareAdminPage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const t = await getTranslations({ locale, namespace: 'Admin' });
  const resources = await prisma.shareResource.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">{t('share')}</h2>
        <Link
          href="/admin/share/new"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          <Icon icon="ph:plus" className="mr-2 h-4 w-4" />
          {t('actions.new')}
        </Link>
      </div>

      <div className="rounded-md border bg-card">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm text-left">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[50px]">Icon</th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">{t('list.title')}</th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">{t('list.category')}</th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Link</th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">{t('list.actions')}</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {resources.map((resource) => (
                <tr key={resource.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle">
                    {resource.iconName ? (
                      <Icon icon={resource.iconName} className="w-6 h-6 text-muted-foreground" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-muted" />
                    )}
                  </td>
                  <td className="p-4 align-middle font-medium">{resource.title}</td>
                  <td className="p-4 align-middle">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${resource.category.color?.replace('text-', 'bg-')}/10 ${resource.category.color}`}>
                      {resource.category.name}
                    </span>
                  </td>
                  <td className="p-4 align-middle text-muted-foreground truncate max-w-[200px]">{resource.link}</td>
                  <td className="p-4 align-middle text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/share/${resource.id}/edit`} className="p-2 hover:bg-muted rounded-md transition-colors">
                        <Icon icon="ph:pencil-simple" className="w-4 h-4 text-muted-foreground" />
                      </Link>
                      <form action={async () => {
                        'use server'
                        await deleteShareResource(resource.id)
                      }}>
                        <button className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors">
                          <Icon icon="ph:trash" className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {resources.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    {t('list.noData')}
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
