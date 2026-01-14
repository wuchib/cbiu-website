import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [
      { order: 'asc' },
      { createdAt: 'desc' }
    ],
    // include: { tags: { include: { tag: true } } } // Uncomment when tags are active
  })

  return (
    <div className="container relative mx-auto min-h-screen max-w-5xl px-4 py-24">
      {/* Background Element */}
      <div className="absolute -right-20 bottom-20 z-0 opacity-5 dark:opacity-[0.02]">
        <Icon icon="ph:code-block-thin" width={600} height={600} />
      </div>

      <div className="relative z-10">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Open Source Projects</h1>
          <p className="text-muted-foreground">A collection of my open source contributions and personal projects.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <Card key={project.id} className="flex flex-col overflow-hidden">
              {project.thumbnail && (
                <div className="h-40 w-full overflow-hidden border-b bg-muted">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                  {project.featured && (
                    <div className="flex items-center gap-1 text-sm text-yellow-500">
                      <Icon icon="ph:star-fill" />
                    </div>
                  )}
                </div>
                <CardDescription className="line-clamp-2">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex flex-wrap gap-2">
                  {/* Tags placeholder - ideally fetch distinct tags or from relation */}
                  {['project'].map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex gap-2 w-full">
                  {project.githubUrl && (
                    <Link href={project.githubUrl} target="_blank" className="flex-1">
                      <Button variant="outline" className="w-full gap-2">
                        <Icon icon="mdi:github" /> Source
                      </Button>
                    </Link>
                  )}
                  {project.demoUrl && (
                    <Link href={project.demoUrl} target="_blank" className="flex-1">
                      <Button variant="default" className="w-full gap-2">
                        <Icon icon="ph:desktop" /> Demo
                      </Button>
                    </Link>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}

          {projects.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground">
              No projects found. Check back later!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
