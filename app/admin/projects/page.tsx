import { prisma } from "@/lib/prisma"
import { Icon } from "@iconify/react"
import Link from "next/link"
import { deleteProject } from "@/actions/projects"

export const dynamic = 'force-dynamic'

export default async function ProjectsAdminPage() {
  const projects = await prisma.project.findMany({
    orderBy: { order: 'asc' }, // Order by manual order first
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          <Icon icon="ph:plus" className="mr-2 h-4 w-4" />
          Add Project
        </Link>
      </div>

      <div className="rounded-md border bg-card">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm text-left">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[50px]">Img</th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[40%]">Title</th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Links</th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Featured</th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {projects.map((project) => (
                <tr key={project.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle">
                    <div className="w-10 h-10 rounded bg-muted overflow-hidden">
                      {project.thumbnail && <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />}
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <div className="font-medium">{project.title}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">{project.description}</div>
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex gap-2">
                      {project.demoUrl && <Icon icon="ph:desktop-duotone" className="w-4 h-4 text-blue-500" />}
                      {project.githubUrl && <Icon icon="ph:github-logo-duotone" className="w-4 h-4" />}
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    {project.featured && (
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-800">
                        Star
                      </span>
                    )}
                  </td>
                  <td className="p-4 align-middle text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/projects/${project.id}/edit`} className="p-2 hover:bg-muted rounded-md transition-colors">
                        <Icon icon="ph:pencil-simple" className="w-4 h-4 text-muted-foreground" />
                      </Link>
                      <form action={async () => {
                        'use server'
                        await deleteProject(project.id)
                      }}>
                        <button className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors">
                          <Icon icon="ph:trash" className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No projects found. Add your portfolio item!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
