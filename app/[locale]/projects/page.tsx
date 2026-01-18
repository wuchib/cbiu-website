import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { getTranslations } from "next-intl/server"

export default async function ProjectsPage() {
  const t = await getTranslations("Projects")
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
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <Card key={project.id} className="flex flex-col overflow-hidden group transition-all duration-300 border-border/60 hover:border-primary/30 hover:shadow-xl hover:bg-accent/5">
              {project.thumbnail && (
                <div className="h-32 w-full overflow-hidden border-b bg-muted relative">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* @ts-ignore */}
                  {project.stars > 0 && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                      <Icon icon="ph:star-fill" className="text-yellow-400 w-3 h-3" />
                      {/* @ts-ignore */}
                      {project.stars}
                    </div>
                  )}
                </div>
              )}
              <CardHeader className="p-4 pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="line-clamp-1 text-base font-medium">{project.title}</CardTitle>
                </div>
                <CardDescription className="line-clamp-2 text-xs">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 p-4 pt-2">
                <div className="flex flex-wrap gap-1">
                  {/* Tags placeholder */}
                  {['project'].map(tag => (
                    <Badge key={tag} variant="secondary" className="text-[10px] h-5 px-1.5 font-normal bg-secondary/50">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <div className="flex gap-2 w-full">
                  {project.githubUrl && (
                    <Link href={project.githubUrl} target="_blank" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full gap-2 h-8 text-xs">
                        <Icon icon="mdi:github" /> {t("source")}
                      </Button>
                    </Link>
                  )}
                  {project.demoUrl && (
                    <Link href={project.demoUrl} target="_blank" className="flex-1">
                      <Button variant="default" size="sm" className="w-full gap-2 h-8 text-xs">
                        <Icon icon="ph:desktop" /> {t("demo")}
                      </Button>
                    </Link>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}

          {projects.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground">
              {t("noProjects")}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
