"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton"
import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { getPublicProjects } from "@/actions/projects"
import { Project } from "@prisma/client"

interface ProjectListProps {
  initialProjects: Project[]
  initialHasMore: boolean
}

export function ProjectList({ initialProjects, initialHasMore }: ProjectListProps) {
  const t = useTranslations("Projects")

  const [projects, setProjects] = useState(initialProjects)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [loading, setLoading] = useState(false)

  const loadMore = async () => {
    if (loading || !hasMore) return
    setLoading(true)
    const nextPage = page + 1
    const res = await getPublicProjects(nextPage, 12)
    if (res.success) {
      setProjects(prev => [...prev, ...res.data])
      setPage(nextPage)
      setHasMore(res.hasMore)
    }
    setLoading(false)
  }

  return (
    <div className="container relative mx-auto min-h-screen max-w-5xl px-4 py-32">
      {/* Background Element */}
      <div className="absolute -right-20 bottom-20 z-0 opacity-5 dark:opacity-[0.02]">
        <Icon icon="ph:code-block-thin" width={600} height={600} />
      </div>


      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <Card key={project.id} className="flex flex-col overflow-hidden group transition-all duration-300 border-border/60 hover:border-primary/30 hover:shadow-xl hover:bg-accent/5">
            {project.thumbnail && (
              <div className="h-32 w-full overflow-hidden border-b relative">
                <ImageWithSkeleton
                  src={project.thumbnail}
                  alt={project.title}
                  wrapperClassName="h-full w-full"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {project.stars > 0 && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                    <Icon icon="ph:star-fill" className="text-yellow-400 w-3 h-3" />
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

      {hasMore && (
        <div className="mt-12 flex justify-center pb-8">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={loading}
            className="gap-2 min-w-[140px]"
          >
            {loading && <Icon icon="ph:spinner-gap" className="animate-spin w-4 h-4" />}
            {loading ? t("loading") : t("loadMore")}
          </Button>
        </div>
      )}
    </div>
  )
}
