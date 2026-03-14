"use client"

import { useEffect } from "react"
import { articleStore } from "@/lib/article-store"

export function ArticleStoreUpdater({ content }: { content: string }) {
  useEffect(() => {
    articleStore.setContent(content)
    return () => articleStore.setContent('')
  }, [content])

  return null
}
