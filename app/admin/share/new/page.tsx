import { prisma } from "@/lib/prisma"
import ShareForm from "@/components/admin/share-form"
import Link from "next/link"
import { Icon } from "@iconify/react"
import { getTranslations } from "next-intl/server"
import { cookies } from "next/headers"

export default async function NewSharePage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const t = await getTranslations({ locale, namespace: 'Admin' });
  const categories = await prisma.shareCategory.findMany({
    select: { key: true, name: true },
    orderBy: { sortOrder: 'asc' }
  })

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/share" className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
          <Icon icon="ph:arrow-left" className="w-5 h-5 text-muted-foreground" />
        </Link>
        <h2 className="text-2xl font-bold tracking-tight">{t('shareForm.pageTitle')}</h2>
      </div>

      <ShareForm categories={categories} />
    </div>
  )
}
