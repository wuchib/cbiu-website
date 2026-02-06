'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function VisitorTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // 延迟发送，避免影响页面加载
    const timer = setTimeout(() => {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: pathname,
          referer: document.referrer || undefined
        })
      }).catch(() => {
        // 静默失败，不影响用户体验
      })
    }, 100)

    return () => clearTimeout(timer)
  }, [pathname])

  return null
}
