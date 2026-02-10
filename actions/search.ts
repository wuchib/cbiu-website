"use server"

import { prisma } from "@/lib/prisma"

export type SearchResults = {
  articles: {
    id: string
    title: string
    slug: string
    description: string | null
    category: { name: string } | null
  }[]
  projects: {
    id: string
    title: string
    slug: string
    description: string
  }[]
  resources: {
    id: string
    title: string
    link: string
    description: string
    category: { name: string }
  }[]
}

export async function searchGlobal(query: string): Promise<SearchResults> {
  if (!query || query.trim().length === 0) {
    return { articles: [], projects: [], resources: [] }
  }

  const normalizedQuery = query.trim()

  const [articles, projects, resources] = await Promise.all([
    prisma.article.findMany({
      where: {
        OR: [
          { title: { contains: normalizedQuery } },
          { description: { contains: normalizedQuery } },
        ],
        published: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        category: {
          select: {
            name: true,
          },
        },
      },
      take: 5,
    }),
    prisma.project.findMany({
      where: {
        OR: [
          { title: { contains: normalizedQuery } },
          { description: { contains: normalizedQuery } },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
      },
      take: 5,
    }),
    prisma.shareResource.findMany({
      where: {
        OR: [
          { title: { contains: normalizedQuery } },
          { description: { contains: normalizedQuery } },
        ],
      },
      select: {
        id: true,
        title: true,
        link: true,
        description: true,
        category: {
          select: {
            name: true,
          },
        },
      },
      take: 5,
    }),
  ])

  return { articles, projects, resources }
}
