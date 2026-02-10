import Link from "next/link"
import { getFriendLinks, deleteFriendLink } from "@/actions/friend-link"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Pencil, Trash2, Plus } from "lucide-react"
import { DeleteButton } from "@/components/admin/delete-button"

export default async function AdminFriendsPage() {
  const { data: links } = await getFriendLinks()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Friend Links</h2>
        <div className="flex items-center space-x-2">
          <Link href="/admin/friends/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Link
            </Button>
          </Link>
        </div>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Link</TableHead>
              <TableHead>Sort Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links?.map((link) => (
              <TableRow key={link.id}>
                <TableCell>
                  {link.avatar && (
                    <img
                      src={link.avatar}
                      alt={link.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  )}
                </TableCell>
                <TableCell className="font-medium">{link.name}</TableCell>
                <TableCell>
                  <a
                    href={link.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {link.link}
                  </a>
                </TableCell>
                <TableCell>{link.sortOrder}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/friends/${link.id}`}>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <DeleteButton id={link.id} deleteAction={deleteFriendLink} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {(!links || links.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No friend links found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
