import { FriendLinkForm } from "@/components/admin/friend-link-form"

export default function NewFriendLinkPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center space-x-2">
        <h2 className="text-3xl font-bold tracking-tight">Create Friend Link</h2>
      </div>
      <div className="max-w-2xl">
        <FriendLinkForm />
      </div>
    </div>
  )
}
