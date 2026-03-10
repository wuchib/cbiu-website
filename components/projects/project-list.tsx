"use client"

import { useState } from "react"
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
    <div className="container relative mx-auto min-h-screen max-w-5xl px-4 pb-8 pt-10">
      {projects.length > 0 ? (
        <div className="overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[4px]">
            {projects.map((project) => (
              <div key={project.id} className="relative flex flex-col bg-card">

                <div className="relative z-10 flex flex-col h-full">
                  {/* 项目缩略图 */}
                  {project.thumbnail && (
                    <div className="relative h-28 w-full rounded-md overflow-hidden">
                      <ImageWithSkeleton
                        src={project.thumbnail}
                        alt={project.title}
                        wrapperClassName="h-full w-full bg-muted/20"
                        className="h-full w-full object-cover"
                      />

                    </div>
                  )}

                  {/* 内容区 */}
                  <div className="flex flex-col flex-1 p-2 relative">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="line-clamp-1 text-base font-medium tracking-tight">
                          {project.title}
                        </h3>
                        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground mt-1">
                          {project.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {project.githubUrl && (
                          <Link href={project.githubUrl} target="_blank" title={t("source")}>
                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-none cursor-pointer bg-muted/40 hover:bg-muted/40 hover:opacity-70 transition-opacity duration-300">
                              <Icon icon="mdi:github" className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                        )}
                        {project.demoUrl && (
                          <Link href={project.demoUrl} target="_blank" title={t("demo")}>
                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-none cursor-pointer bg-muted/40 hover:bg-muted/40 hover:opacity-70 transition-opacity duration-300">
                              <Icon icon="ph:arrow-up-right-bold" className="w-3 h-3" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                      {/* Tags */}
                      {['project'].map(tag => (
                        <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 rounded-none font-normal bg-secondary/40 hover:bg-secondary/60 transition-colors text-muted-foreground/80">
                          {tag}
                        </Badge>
                      ))}

                      {project.stars > 0 && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 rounded-none font-normal bg-secondary/40 hover:bg-secondary/60 transition-colors text-muted-foreground/80 flex items-center gap-1">
                          <Icon icon="ph:star-fill" className="text-yellow-400 w-2.5 h-2.5" />
                          {project.stars >= 1000 ? (project.stars / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : project.stars}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* 当卡片数量为奇数时，补充一个空的占位块以保持无间隔网格布局的完整性 (仅在中等以上屏幕显示2列时需要) */}
            {projects.length % 2 !== 0 && (
              <div className="hidden md:block bg-card w-full h-full" />
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center border border-border/40 rounded-none bg-border/10 border-dashed">
          <Icon icon="ph:folder-open-duotone" className="w-10 h-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">{t("noProjects")}</p>
        </div>
      )}

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
