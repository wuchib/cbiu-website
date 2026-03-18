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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    code: CodeBlock as any,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [headingIdMap])

  // Reset render counters before each render
  renderCounters.current.clear()

  const articleProseClassName = [
    "prose max-w-none flex-1 min-w-0 lg:prose-lg",
    "prose-headings:scroll-mt-24 prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-[#2B241F]",
    "prose-h1:text-[28px]",
    "prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-[22px]",
    "prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-[18px]",
    "prose-h4:mt-5 prose-h4:mb-2 prose-h4:text-[16px]",
    "prose-p:my-4 prose-p:text-[#5B5147] prose-p:leading-[1.9]",
    "prose-a:font-medium prose-a:text-[#B67A4D] prose-a:no-underline prose-a:decoration-[#D4A574]/70 prose-a:underline-offset-4 hover:prose-a:text-[#8F5D36] hover:prose-a:underline",
    "prose-strong:font-semibold prose-strong:text-[#352B24]",
    "prose-em:text-[#72665B]",
    "prose-ul:my-3 prose-ul:text-[#5B5147] prose-ol:my-3 prose-ol:text-[#5B5147] prose-li:my-1",
    "[&_li::marker]:text-[#C4956A]",
    "prose-code:rounded-md prose-code:border prose-code:border-[#E0D0C0] prose-code:bg-[#EEE2D5] prose-code:px-1.5 prose-code:py-0.5 prose-code:font-normal prose-code:text-[#8F5F3E] dark:prose-code:border-[#4B4037] dark:prose-code:bg-[#2B241F] dark:prose-code:text-[#D8B08C] prose-code:before:content-none prose-code:after:content-none",
    "prose-pre:my-5 prose-pre:bg-transparent prose-pre:p-0 prose-pre:text-[#F3EBE1] [&_pre_code]:border-0 [&_pre_code]:bg-transparent [&_pre_code]:px-0 [&_pre_code]:py-0 [&_pre_code]:text-inherit [&_pre_code]:rounded-none [&_pre_code]:shadow-none",
    "prose-blockquote:my-5 prose-blockquote:rounded-r-2xl prose-blockquote:border-l-4 prose-blockquote:border-l-[#D4A574] prose-blockquote:bg-[#EFE4D8] prose-blockquote:px-5 prose-blockquote:py-3 prose-blockquote:text-[15px] prose-blockquote:not-italic prose-blockquote:text-[#7A6E63] dark:prose-blockquote:border-l-[#B67A4D] dark:prose-blockquote:bg-[#2A241F] dark:prose-blockquote:text-[#C9BAAC]",
    "prose-hr:my-8 prose-hr:border-[#E3D6C8] dark:prose-hr:border-[#463B34]",
    "prose-img:my-5 prose-img:rounded-2xl prose-img:border prose-img:border-[#E6DACD] prose-img:shadow-[0_12px_30px_rgba(44,37,32,0.08)]",
    "[&_pre>div]:overflow-hidden [&_pre>div]:rounded-xl [&_pre>div]:border-0 [&_pre>div]:shadow-[0_10px_24px_rgba(44,37,32,0.12)]",
    "prose-table:my-6 prose-table:w-full prose-table:overflow-hidden prose-table:rounded-2xl prose-table:border prose-table:border-[#DDD0C1] prose-table:bg-[#F6EEE6] dark:prose-table:border-[#443b35] dark:prose-table:bg-[#241F1B]",
    "prose-th:border-[#DDD0C1] prose-th:bg-[#E8DBCD] prose-th:p-3 prose-th:text-center prose-th:text-[#352B24] dark:prose-th:border-[#443b35] dark:prose-th:bg-[#312922] dark:prose-th:text-[#E6D8CA]",
    "prose-td:border-[#E2D6CA] prose-td:bg-[#F2E7DC] prose-td:p-3 prose-td:align-middle prose-td:text-[#5B5147] dark:prose-td:border-[#443b35] dark:prose-td:bg-[#2A241F] dark:prose-td:text-[#CBBCAF]",
    "[&_thead_tr]:border-b [&_thead_tr]:border-[#DDD0C1] dark:[&_thead_tr]:border-[#443b35]",
    "[&_tbody_tr]:border-b [&_tbody_tr]:border-[#E2D6CA] dark:[&_tbody_tr]:border-[#443b35]",
    "[&_tbody_tr:last-child]:border-b-0",
    "[&_tbody_tr:nth-child(even)_td]:bg-[#EDE1D5] dark:[&_tbody_tr:nth-child(even)_td]:bg-[#231D19]",
  ].join(" ")

  return (
    <div>
      <article className={articleProseClassName}>
        <div className="mb-8 border-b border-[#E4D7CA] dark:border-[#443b35] pb-8 ">
          <h1 className="mb-2 text-[28px] font-bold tracking-tight text-[#2B241F]">{article.title}</h1>

          <div className="mt-4 flex items-center gap-4 text-[#87786D]">
            <time className="flex items-center gap-1.5 text-[13px]">{article.date}</time>
            {article.tags && article.tags.length > 0 && (
              <div className="flex items-center gap-2">
                {article.tags.map(tag => (
                  <span key={tag} className="rounded-full border border-[#E4D5C6] bg-[#F2E8DD] px-2.5 py-0.5 text-[12px] text-[#6B5D51]">#{tag}</span>
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
          <nav className="not-prose mt-8 border-t border-[#E4D7CA] dark:border-[#443b35] py-8">
            <div className="flex items-stretch justify-between gap-4">
              {/* 上一篇 */}
              {prevArticle ? (
                <Link
                  href={`/articles/${prevArticle.slug}`}
                  className="group flex flex-col gap-1.5 max-w-[45%] text-left no-underline"
                >
                  <span className="flex items-center gap-1 text-[12px] text-[#8A7C70]">
                    <ArrowLeft className="h-3 w-3" />
                    上一篇
                  </span>
                  <span className="line-clamp-2 text-[14px] font-medium text-[#2B241F] transition-colors group-hover:text-[#B67A4D]">
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
                  <span className="flex items-center gap-1 text-[12px] text-[#8A7C70]">
                    下一篇
                    <ArrowRight className="h-3 w-3" />
                  </span>
                  <span className="line-clamp-2 text-[14px] font-medium text-[#2B241F] transition-colors group-hover:text-[#B67A4D]">
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

