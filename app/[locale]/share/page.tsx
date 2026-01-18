import { getTranslations } from "next-intl/server"
import { prisma } from "@/lib/prisma"
import SharePageClient from "./share-page-client"

export default async function SharePage() {
  const t = await getTranslations("Share")

  const categories = await prisma.shareCategory.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      resources: {
        orderBy: { order: 'asc' }
      }
    }
  })

  return (
    <SharePageClient
      categories={categories}
      title={t("title")}
      description={t("description")}
    />
  )
}
