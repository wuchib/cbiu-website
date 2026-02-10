"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { searchGlobal, type SearchResults } from "@/actions/search"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Icon } from "@iconify/react"

export function SearchCommand({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<SearchResults | null>(null)
  const [isPending, startTransition] = React.useTransition()

  React.useEffect(() => {
    if (query.length === 0) {
      setResults(null)
      return
    }

    const timer = setTimeout(() => {
      startTransition(async () => {
        const data = await searchGlobal(query)
        setResults(data)
      })
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const handleSelect = React.useCallback((callback: () => void) => {
    onOpenChange(false)
    callback()
  }, [onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <DialogTitle className="sr-only">Search</DialogTitle>
        <Command
          shouldFilter={false}
          className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
        >
          <CommandInput
            placeholder="Search articles, projects, tools..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>
              {isPending ? "Searching..." : "No results found."}
            </CommandEmpty>

            {results?.articles.length ? (
              <CommandGroup heading="Articles">
                {results.articles.map((article) => (
                  <CommandItem
                    key={article.id}
                    value={`article-${article.id}`}
                    onSelect={() => {
                      handleSelect(() => router.push(`/articles/${article.slug}`))
                    }}
                  >
                    <Icon icon="ph:read-cv-logo" className="mr-2 h-4 w-4" />
                    <span>{article.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}

            {results?.projects.length ? (
              <CommandGroup heading="Projects">
                {results.projects.map((project) => (
                  <CommandItem
                    key={project.id}
                    value={`project-${project.id}`}
                    onSelect={() => {
                      handleSelect(() => router.push(`/projects/${project.slug}`))
                    }}
                  >
                    <Icon icon="ph:code-bold" className="mr-2 h-4 w-4" />
                    <span>{project.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}

            {results?.resources.length ? (
              <CommandGroup heading="Tools & Resources">
                {results.resources.map((resource) => (
                  <CommandItem
                    key={resource.id}
                    value={`resource-${resource.id}`}
                    onSelect={() => {
                      handleSelect(() => window.open(resource.link, '_blank'))
                    }}
                  >
                    <Icon icon="ph:wrench-bold" className="mr-2 h-4 w-4" />
                    <span>{resource.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
