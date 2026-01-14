import ProjectForm from "@/components/admin/project-form"
import Link from "next/link"
import { Icon } from "@iconify/react"

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/projects" className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
          <Icon icon="ph:arrow-left" className="w-5 h-5 text-muted-foreground" />
        </Link>
        <h2 className="text-2xl font-bold tracking-tight">Add New Project</h2>
      </div>

      <ProjectForm />
    </div>
  )
}
