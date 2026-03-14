const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
const HEATMAP_DAYS = 63
const HEATMAP_TIME_ZONE = "Asia/Shanghai"
const TEST_PREFIX = "heatmap-test"
const formatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: HEATMAP_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
})

function formatDateKey(date) {
  return formatter.format(date)
}

function getHeatmapLevel(count) {
  if (count <= 0) return 0
  if (count === 1) return 1
  if (count <= 5) return 2
  return 3
}

async function main() {
  const today = new Date()
  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() - (HEATMAP_DAYS - 1))
  startDate.setHours(0, 0, 0, 0)

  const endDate = new Date(today)
  endDate.setHours(23, 59, 59, 999)

  const articles = await prisma.article.findMany({
    where: {
      published: true,
      slug: {
        startsWith: TEST_PREFIX,
      },
      publishedAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      slug: true,
      publishedAt: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
  })

  const counts = new Map()

  for (const article of articles) {
    if (!article.publishedAt) continue
    const key = formatDateKey(article.publishedAt)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  const rows = []

  for (const [date, count] of counts.entries()) {
    if (count <= 0) continue
    rows.push({
      date,
      count,
      level: getHeatmapLevel(count),
    })
  }

  rows.sort((a, b) => a.date.localeCompare(b.date))

  console.log("Non-empty heatmap test days:", rows.length)
  console.table(rows)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
