"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface TableOfContentsProps {
  headings: {
    id: string
    text: string
    level: number
  }[]
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "0% 0% -80% 0%" }
    )

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id)
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [headings])

  if (!headings?.length) {
    return null
  }

  return (
    <div className="space-y-2">
      <p className="font-medium text-muted-foreground mb-4">On this page</p>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ marginLeft: `${(heading.level - 1) * 12}px` }}
          >
            <a
              href={`#${heading.id}`}
              className={cn(
                "block border-l-2 pl-3 py-1 transition-all hover:text-primary hover:border-border line-clamp-2 text-xs",
                activeId === heading.id
                  ? "border-primary text-primary font-bold scale-105 origin-left"
                  : headings.findIndex(h => h.id === activeId) > headings.findIndex(h => h.id === heading.id)
                    ? "border-primary/40 text-primary/80"
                    : "border-transparent text-muted-foreground/70"
              )}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: "smooth",
                })
                setActiveId(heading.id);
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
