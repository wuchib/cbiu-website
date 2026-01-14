import { prisma } from "@/lib/prisma"
import ShareForm from "@/components/admin/share-form"
import Link from "next/link"
import { Icon } from "@iconify/react"

export default async function NewSharePage() {
  const categories = await prisma.shareCategory.findMany({
    select: { key: true, name: true },
    orderBy: { sortOrder: 'asc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/share" className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
          <Icon icon="ph:arrow-left" className="w-5 h-5 text-muted-foreground" />
        </Link>
        <h2 className="text-2xl font-bold tracking-tight">Create New Resource</h2>
      </div>

      <ShareForm categories={categories} />
    </div>
  )
}
