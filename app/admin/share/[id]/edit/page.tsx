import ShareForm from "@/components/admin/share-form"
import Link from "next/link"
import { Icon } from "@iconify/react"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function EditSharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const resource = await prisma.shareResource.findUnique({
    where: { id }
  })

  if (!resource) {
    notFound()
  }

  const categories = await prisma.shareCategory.findMany()

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/share" className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
          <Icon icon="ph:arrow-left" className="w-5 h-5 text-muted-foreground" />
        </Link>
        <h2 className="text-2xl font-bold tracking-tight">Edit Share Resource</h2>
      </div>

      <ShareForm resource={resource} categories={categories} />
    </div>
  )
}
