import { prisma } from "./prisma"

const HEATMAP_DAYS = 63
const HEATMAP_TIME_ZONE = "Asia/Shanghai"

export type HeatmapCell = {
  date: string
  count: number
  level: 0 | 1 | 2 | 3
}

function formatDateKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: HEATMAP_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date)
}

function getHeatmapLevel(count: number): 0 | 1 | 2 | 3 {
  if (count <= 0) return 0
  if (count === 1) return 1
  if (count <= 5) return 2
  return 3
}

export async function getArticleHeatmapData() {
  const today = new Date()
  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() - (HEATMAP_DAYS - 1))
  startDate.setHours(0, 0, 0, 0)

  const endDate = new Date(today)
  endDate.setHours(23, 59, 59, 999)

  const articles = await prisma.article.findMany({
    where: {
      published: true,
      publishedAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      publishedAt: true,
    },
  })

  const counts = new Map<string, number>()

  for (const article of articles) {
    if (!article.publishedAt) continue
    const key = formatDateKey(article.publishedAt)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  const cells: HeatmapCell[] = []

  for (let offset = 0; offset < HEATMAP_DAYS; offset += 1) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + offset)

    const key = formatDateKey(date)
    const count = counts.get(key) ?? 0

    cells.push({
      date: key,
      count,
      level: getHeatmapLevel(count),
    })
  }

  const weeks = Array.from({ length: HEATMAP_DAYS / 7 }, (_, weekIndex) =>
    cells.slice(weekIndex * 7, weekIndex * 7 + 7)
  )

  return {
    weeks,
    totalPublishedArticles: articles.length,
  }
}
