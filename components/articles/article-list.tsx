"use client"

import { Link } from "@/i18n/routing"
import { motion } from "framer-motion"
import { Icon } from "@iconify/react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Article } from "@/lib/articles"
import { useTranslations } from "next-intl"

interface ArticleListProps {
  articles: Article[]
}

export function ArticleList({ articles }: ArticleListProps) {
  const t = useTranslations("Navigation")
  const tArticles = useTranslations("Articles")

  return (
    <div className="container relative mx-auto min-h-screen max-w-5xl px-4 py-24">
      {/* Background decoration */}
      <div className="absolute top-20 right-0 -z-10 opacity-5">
        <Icon icon="ph:read-cv-logo-bold" className="h-96 w-96" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
          {t("articles")}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {tArticles("description")}
        </p>
      </motion.div>

      <div className="relative">
        {/* Timeline Line (Right Side) */}
        <div className="absolute right-8 top-0 bottom-0 w-px bg-border/50 hidden md:block" />

        <div className="space-y-4 md:space-y-6">
          {articles.map((article, index) => (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative flex flex-col md:flex-row md:items-start md:gap-8"
            >
              {/* Timeline Dot */}
              <div className="absolute right-[27px] top-6 z-10 hidden md:flex h-3 w-3 items-center justify-center rounded-full bg-background ring-2 ring-border transition-colors group-hover:ring-primary">
                <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground transition-colors group-hover:bg-primary" />
              </div>

              {/* Article Content */}
              <Link href={`/articles/${article.slug}`} className="flex-1">
                <Card className="overflow-hidden border-border/40 bg-background/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-muted/30 hover:shadow-lg hover:shadow-primary/5">
                  <div className="flex flex-col sm:flex-row h-full">
                    {/* Cover Image (Compact) */}
                    <div className="relative h-32 w-full shrink-0 overflow-hidden bg-muted sm:h-32 sm:w-48">
                      {article.cover ? (
                        <img
                          src={article.cover}
                          alt={article.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-secondary/30">
                          <Icon icon="ph:article-medium" className="h-8 w-8 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-4">
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <Icon icon="ph:calendar-blank" className="h-3 w-3" />
                          {new Date(article.date).toLocaleDateString()}
                        </span>
                        {article.tags && article.tags.length > 0 && (
                          <>
                            <span>•</span>
                            <div className="flex gap-1">
                              {article.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="h-4 px-1 text-[9px] hover:bg-primary hover:text-primary-foreground">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </>
                        )}
                      </div>

                      <h2 className="mb-1 text-lg font-bold tracking-tight transition-colors group-hover:text-primary line-clamp-1">
                        {article.title}
                      </h2>

                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {article.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
