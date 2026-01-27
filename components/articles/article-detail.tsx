"use client"

import ReactMarkdown from "react-markdown"
import { TableOfContents } from "./table-of-contents"
import { Article } from "@/lib/articles"
import { slugify } from "@/lib/slugify"
import React from "react"
import { useTranslations } from "next-intl"

interface ArticleDetailProps {
  article: Article
}

export function ArticleDetail({ article }: ArticleDetailProps) {
  const t = useTranslations("Articles")

  // Track heading occurrences for unique ID generation
  const headingCounters = React.useRef(new Map<string, number>())

  const getUniqueHeadingId = (text: string) => {
    const count = headingCounters.current.get(text) || 0
    headingCounters.current.set(text, count + 1)
    const baseId = slugify(text)
    return count > 0 ? `${baseId}-${count}` : baseId
  }

  const components = {
    h1: ({ children, ...props }: any) => {
      const text = React.Children.toArray(children).join("")
      const id = getUniqueHeadingId(text)
      return <h1 id={id} {...props}>{children}</h1>
    },
    h2: ({ children, ...props }: any) => {
      const text = React.Children.toArray(children).join("")
      const id = getUniqueHeadingId(text)
      return <h2 id={id} {...props}>{children}</h2>
    },
    h3: ({ children, ...props }: any) => {
      const text = React.Children.toArray(children).join("")
      const id = getUniqueHeadingId(text)
      return <h3 id={id} {...props}>{children}</h3>
    },
    img: ({ node, src, alt, ...props }: any) => {
      // Don't render img if src is empty to prevent console warnings
      if (!src) return null;
      return <img src={src} alt={alt || ''} {...props} />;
    }
  }

  const headings = React.useMemo(() => {
    const lines = article.content.split("\n")
    const extracted = []
    const textOccurrences = new Map<string, number>()
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

        extracted.push({ id, text, level })
      }
    }
    return extracted
  }, [article.content])


  return (
    <div className="relative lg:flex lg:gap-10 xl:gap-20 items-start">
      <article className="prose prose-stone dark:prose-invert max-w-none flex-1 min-w-0 lg:prose-lg">
        <div className="mb-8 border-b pb-8">
          <h1 className="mb-2 text-4xl font-extrabold tracking-tight lg:text-5xl">{article.title}</h1>
          <p className="text-xl text-muted-foreground">{article.description}</p>

          <div className="mt-4 flex items-center gap-4">
            <time className="block text-sm text-muted-foreground">{article.date}</time>
            {article.tags?.map(tag => (
              <span key={tag} className="text-sm px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{tag}</span>
            ))}
          </div>
        </div>

        {/* Mobile TOC */}
        <div className="lg:hidden mb-8 rounded-lg border bg-card text-card-foreground shadow-sm">
          <details className="group">
            <summary className="flex cursor-pointer items-center justify-between p-4 font-medium transition-colors hover:text-primary">
              <span>{t("tableOfContents")}</span>
              <span className="transition-transform group-open:rotate-180">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </summary>
            <div className="border-t p-4 pt-0">
              <TableOfContents headings={headings} />
            </div>
          </details>
        </div>

        <ReactMarkdown components={components}>
          {article.content}
        </ReactMarkdown>
      </article>

      <aside className="hidden lg:block w-64 shrink-0 sticky top-24">
        <TableOfContents headings={headings} />
      </aside>
    </div>
  )
}
