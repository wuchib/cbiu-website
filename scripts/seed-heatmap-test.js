const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
const TEST_PREFIX = "heatmap-test"

function atLocalNoon(daysAgo) {
  const now = new Date()
  const local = new Date(now)
  local.setDate(local.getDate() - daysAgo)
  local.setHours(12, 0, 0, 0)
  return local
}

async function main() {
  const plan = [
    { daysAgo: 1, count: 1 },
    { daysAgo: 3, count: 2 },
    { daysAgo: 8, count: 5 },
    { daysAgo: 12, count: 6 },
    { daysAgo: 20, count: 3 },
  ]

  await prisma.article.deleteMany({
    where: {
      slug: {
        startsWith: TEST_PREFIX,
      },
    },
  })

  const rows = plan.flatMap(({ daysAgo, count }) =>
    Array.from({ length: count }, (_, index) => ({
      slug: `${TEST_PREFIX}-${daysAgo}-${index + 1}`,
      title: `Heatmap Test ${daysAgo}-${index + 1}`,
      description: "Heatmap verification article",
      content: `Seeded heatmap verification content ${daysAgo}-${index + 1}`,
      published: true,
      publishedAt: atLocalNoon(daysAgo),
    }))
  )

  for (const row of rows) {
    await prisma.article.create({ data: row })
  }

  const created = await prisma.article.findMany({
    where: {
      slug: {
        startsWith: TEST_PREFIX,
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

  const summary = new Map()

  for (const article of created) {
    if (!article.publishedAt) continue
    const key = article.publishedAt.toISOString().slice(0, 10)
    summary.set(key, (summary.get(key) ?? 0) + 1)
  }

  console.log("Inserted heatmap test articles:", created.length)
  console.table(
    Array.from(summary.entries()).map(([date, count]) => ({
      date,
      count,
      expectedLevel: count === 0 ? 0 : count === 1 ? 1 : count <= 5 ? 2 : 3,
    }))
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
