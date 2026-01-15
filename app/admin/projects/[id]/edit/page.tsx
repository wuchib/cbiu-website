import ProjectForm from "@/components/admin/project-form"
import Link from "next/link"
import { Icon } from "@iconify/react"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id }
  })

  if (!project) {
    notFound()
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/projects" className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
          <Icon icon="ph:arrow-left" className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight leading-none">Edit Project</h2>
          <p className="text-xs text-muted-foreground font-mono">{project.slug}</p>
        </div>
      </div>

      <ProjectForm project={project} />
    </div>
  )
}
