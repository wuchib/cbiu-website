"use client"

import { Link } from "@/i18n/routing"
import { motion } from "framer-motion"
import { Icon } from "@iconify/react"
import { Article } from "@/lib/articles"


import { useState } from "react"
import { Button } from "@/components/ui/button"
import { getPublicArticles } from "@/actions/articles"

interface ArticleListProps {
  initialArticles: Article[]
  initialHasMore: boolean
}

// 估算阅读时间（分钟）
function estimateReadingTime(description?: string): number {
  if (!description) return 3
  const wordCount = description.length
  // 中文大约每分钟阅读 300-500 字
  return Math.max(1, Math.ceil(wordCount / 400))
}

export function ArticleList({ initialArticles, initialHasMore }: ArticleListProps) {

  const [articles, setArticles] = useState(initialArticles)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [loading, setLoading] = useState(false)

  const loadMore = async () => {
    if (loading || !hasMore) return
    setLoading(true)
    const nextPage = page + 1
    const res = await getPublicArticles(nextPage, 12)
    if (res.success) {
      // @ts-expect-error - response data type mismatch
      setArticles(prev => [...prev, ...res.data])
      setPage(nextPage)
      setHasMore(res.hasMore)
    }
    setLoading(false)
  }

  return (
    <div className="container relative mx-auto min-h-screen max-w-5xl px-4">
      <div>
        {articles.map((article, index) => (
          <motion.div
            key={article.slug}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
          >
            {/* 装饰性分隔符（非首项显示） */}
            {index > 0 && (
              <div className="flex items-center justify-start gap-1 py-2">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span
                    key={i}
                    className="h-[3px] w-[3px] rounded-full bg-muted-foreground/30"
                  />
                ))}
              </div>
            )}

            <Link
              href={`/articles/${article.slug}`}
              className="group block py-5"
            >
              {/* 标题 */}
              <h2 className="text-xl font-bold tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary md:text-2xl">
                {article.title}
              </h2>

              {/* 元信息：日期 + 阅读时间 */}
              <div className="mt-2.5 flex items-center gap-3 text-[13px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Icon icon="ph:calendar-blank" className="h-3.5 w-3.5" />
                  {new Date(article.date).toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Icon icon="ph:clock" className="h-3.5 w-3.5" />
                  {estimateReadingTime(article.description)} min
                </span>
              </div>

              {/* 标签 */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1">
                  {article.tags.map((tag, tagIndex) => (
                    <span
                      key={tag}
                      className="text-[13px] text-primary/80 transition-colors group-hover:text-primary"
                    >
                      #{tag}
                      {tagIndex < article.tags!.length - 1 && (
                        <span className="ml-1.5 text-muted-foreground/40">,</span>
                      )}
                    </span>
                  ))}
                </div>
              )}

              {/* 摘要 */}
              {article.description && (
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground/70">
                  {article.description}
                </p>
              )}
            </Link>
          </motion.div>
        ))}
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
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  )
}
