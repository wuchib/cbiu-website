'use client'

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Icon } from "@iconify/react"

interface PaginationProps {
  totalPages: number
  currentPage: number
}

export function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  // Create an array of pages to show
  // If total pages is small, show all
  // Otherwise show a window around current page
  let pagesToShow = []
  if (totalPages <= 7) {
    pagesToShow = Array.from({ length: totalPages }, (_, i) => i + 1)
  } else {
    if (currentPage <= 4) {
      pagesToShow = [1, 2, 3, 4, 5, '...', totalPages]
    } else if (currentPage >= totalPages - 3) {
      pagesToShow = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    } else {
      pagesToShow = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
    }
  }

  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      <Link
        href={createPageURL(currentPage - 1)}
        className={`inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground ${currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}`}
        aria-disabled={currentPage <= 1}
      >
        <span className="sr-only">Previous page</span>
        <Icon icon="ph:caret-left-bold" className="h-4 w-4" />
      </Link>

      {pagesToShow.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className="px-3 py-2 text-sm text-muted-foreground">
              {page}
            </span>
          )
        }

        const isCurrent = page === currentPage
        return (
          <Link
            key={page}
            href={createPageURL(page)}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-foreground ${isCurrent ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground' : ''}`}
            aria-current={isCurrent ? "page" : undefined}
          >
            {page}
          </Link>
        )
      })}

      <Link
        href={createPageURL(currentPage + 1)}
        className={`inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground ${currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}`}
        aria-disabled={currentPage >= totalPages}
      >
        <span className="sr-only">Next page</span>
        <Icon icon="ph:caret-right-bold" className="h-4 w-4" />
      </Link>
    </div>
  )
}
