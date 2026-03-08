"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Link } from "@/i18n/routing"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { CommentSection } from "./comment-section"
import { CodeBlock } from "./code-block"
import { Article } from "@/lib/articles"
import { slugify } from "@/lib/slugify"
import React from "react"

interface ArticleNavItem {
  slug: string
  title: string
}

interface ArticleDetailProps {
  article: Article
  articleId: string
  prevArticle?: ArticleNavItem | null
  nextArticle?: ArticleNavItem | null
}

export function ArticleDetail({ article, articleId, prevArticle, nextArticle }: ArticleDetailProps) {

  // Pre-compute all heading IDs and their mappings in a stable way
  const { headingIdMap } = React.useMemo(() => {
    const lines = article.content.split("\n")
    const extracted: { id: string; text: string; level: number }[] = []
    const textOccurrences = new Map<string, number>()
    // Map from "level:text:occurrence" to the computed ID
    const idMap = new Map<string, string>()
    let inCodeBlock = false

    for (const line of lines) {
      if (line.trim().startsWith("```")) {
        inCodeBlock = !inCodeBlock
        continue
      }
      if (inCodeBlock) continue

      const match = line.trim().match(/^(#{1,3})\s+(.+)$/)
      if (match) {
        const level = match[1].length
        const text = match[2].trim()
        const baseId = slugify(text)

        // Track occurrences of this text
        const count = textOccurrences.get(text) || 0
        textOccurrences.set(text, count + 1)

        // Generate unique ID by appending counter if duplicate
        const id = count > 0 ? `${baseId}-${count}` : baseId

        // Store mapping for lookup during render
        const key = `${level}:${text}:${count}`
        idMap.set(key, id)

        extracted.push({ id, text, level })
      }
    }
    return { headings: extracted, headingIdMap: idMap }
  }, [article.content])

  // Create a stable counter for each heading level/text combination
  const renderCounters = React.useRef(new Map<string, number>())

  // Reset counters when content changes
  React.useEffect(() => {
    renderCounters.current.clear()
  }, [article.content])

  // Get heading ID from pre-computed map
  const getHeadingId = (level: number, text: string) => {
    const counterKey = `${level}:${text}`
    const count = renderCounters.current.get(counterKey) || 0
    renderCounters.current.set(counterKey, count + 1)

    const mapKey = `${level}:${text}:${count}`
    return headingIdMap.get(mapKey) || slugify(text)
  }

  const components = React.useMemo(() => ({
    h1: ({ children, ...props }: React.ComponentProps<'h1'>) => {
      const text = React.Children.toArray(children).join("")
      const id = getHeadingId(1, text)
      return <h1 id={id} {...props}>{children}</h1>
    },
    h2: ({ children, ...props }: React.ComponentProps<'h2'>) => {
      const text = React.Children.toArray(children).join("")
      const id = getHeadingId(2, text)
      return <h2 id={id} {...props}>{children}</h2>
    },
    h3: ({ children, ...props }: React.ComponentProps<'h3'>) => {
      const text = React.Children.toArray(children).join("")
      const id = getHeadingId(3, text)
      return <h3 id={id} {...props}>{children}</h3>
    },
    h4: ({ children, ...props }: React.ComponentProps<'h4'>) => {
      const text = React.Children.toArray(children).join("")
      const id = getHeadingId(4, text)
      return <h4 id={id} {...props}>{children}</h4>
    },
    h5: ({ children, ...props }: React.ComponentProps<'h5'>) => {
      const text = React.Children.toArray(children).join("")
      const id = getHeadingId(5, text)
      return <h5 id={id} {...props}>{children}</h5>
    },
    h6: ({ children, ...props }: React.ComponentProps<'h6'>) => {
      const text = React.Children.toArray(children).join("")
      const id = getHeadingId(6, text)
      return <h6 id={id} {...props}>{children}</h6>
    },
    img: ({ src, alt, ...props }: React.ComponentProps<'img'>) => {
      if (!src) return null;
      return <img src={src} alt={alt || ''} {...props} />;
    },
    code: CodeBlock as any,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [headingIdMap])

  // Reset render counters before each render
  renderCounters.current.clear()

  return (
    <div>
      <article className="prose max-w-none flex-1 min-w-0 lg:prose-lg prose-headings:text-[#2C2520] prose-h1:text-[28px] prose-h2:text-[22px] prose-h2:mt-6 prose-h2:mb-3 prose-h3:text-[18px] prose-h3:mt-5 prose-h3:mb-2 prose-h4:text-[16px] prose-p:text-[#5C5147] prose-p:my-3 prose-a:text-[#C4956A] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#2C2520] prose-ul:text-[#5C5147] prose-ul:my-2 prose-ol:text-[#5C5147] prose-ol:my-2 prose-li:text-[#5C5147] prose-li:my-0.5 prose-code:text-[#C4956A] prose-code:bg-[#E8DDD0]/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-pre:bg-transparent prose-pre:p-0 prose-pre:text-[#F3EBE1] prose-pre:my-0 [&_pre_code]:bg-transparent prose-blockquote:border-l-[#D4A574] prose-blockquote:bg-[#e6ddd1] prose-blockquote:not-italic prose-blockquote:py-0.5 prose-blockquote:px-5 prose-blockquote:my-4 prose-blockquote:rounded-r-lg prose-blockquote:text-[#A3978C] prose-blockquote:text-sm prose-hr:border-[#E8DDD0] prose-hr:my-6 prose-img:rounded-xl prose-img:border prose-img:border-[#E8DDD0] prose-img:my-4 prose-table:my-4 prose-th:text-[#2C2520] prose-th:bg-[#E8DDD0]/30 prose-th:align-middle prose-th:m-0 prose-th:p-2 prose-th:text-center prose-td:border-[#E8DDD0] prose-td:p-2 prose-td:align-middle">
        <div className="mb-8 border-b border-[#E8DDD0] pb-8">
          <h1 className="mb-2 text-[28px] font-bold tracking-tight text-[#2C2520]">{article.title}</h1>

          <div className="mt-4 flex items-center gap-4 text-[#8B7E74]">
            <time className="flex items-center gap-1.5 text-[13px]">{article.date}</time>
            {article.tags && article.tags.length > 0 && (
              <div className="flex items-center gap-2">
                {article.tags.map(tag => (
                  <span key={tag} className="text-[12px] rounded-full bg-[#E8DDD0] px-2.5 py-0.5 text-[#5C5147]">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={components}
        >
          {article.content}
        </ReactMarkdown>

        {/* 上一篇 / 下一篇导航 - 放在评论区上方 */}
        {(prevArticle || nextArticle) && (
          <nav className="not-prose border-t border-[#E8DDD0] py-8 mt-8">
            <div className="flex items-stretch justify-between gap-4">
              {/* 上一篇 */}
              {prevArticle ? (
                <Link
                  href={`/articles/${prevArticle.slug}`}
                  className="group flex flex-col gap-1.5 max-w-[45%] text-left no-underline"
                >
                  <span className="text-[12px] text-[#8B7E74] flex items-center gap-1">
                    <ArrowLeft className="h-3 w-3" />
                    上一篇
                  </span>
                  <span className="text-[14px] font-medium text-[#2C2520] group-hover:text-[#C4956A] transition-colors line-clamp-2">
                    {prevArticle.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}

              {/* 下一篇 */}
              {nextArticle ? (
                <Link
                  href={`/articles/${nextArticle.slug}`}
                  className="group flex flex-col items-end gap-1.5 max-w-[45%] text-right no-underline"
                >
                  <span className="text-[12px] text-[#8B7E74] flex items-center gap-1">
                    下一篇
                    <ArrowRight className="h-3 w-3" />
                  </span>
                  <span className="text-[14px] font-medium text-[#2C2520] group-hover:text-[#C4956A] transition-colors line-clamp-2">
                    {nextArticle.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </nav>
        )}

        {/* Comment Section - wrapped in not-prose to prevent typography styles from affecting avatars */}
        <div className="not-prose">
          <CommentSection articleId={articleId} />
        </div>
      </article>
    </div>
  )
}

