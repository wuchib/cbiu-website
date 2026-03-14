
import { prisma } from "@/lib/prisma"
import SharePageClient from "./share-page-client"

export default async function SharePage() {

  const resources = await prisma.shareResource.findMany({
    orderBy: [
      { category: { sortOrder: 'asc' } },
      { order: 'asc' }
    ]
  })

  return (
    <SharePageClient
      resources={resources}
    />
  )
}
