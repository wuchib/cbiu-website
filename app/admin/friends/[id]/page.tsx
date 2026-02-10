import { getFriendLink } from "@/actions/friend-link"
import { FriendLinkForm } from "@/components/admin/friend-link-form"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditFriendLinkPage({ params }: PageProps) {
  const { id } = await params
  const { data: link } = await getFriendLink(id)

  if (!link) {
    notFound()
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center space-x-2">
        <h2 className="text-3xl font-bold tracking-tight">Edit Friend Link</h2>
      </div>
      <div className="max-w-2xl">
        <FriendLinkForm initialData={link} />
      </div>
    </div>
  )
}
