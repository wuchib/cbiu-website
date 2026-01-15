import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Icon } from "@iconify/react"
import { getTranslations } from "next-intl/server"
import { div as MotionDiv } from "@/components/motion-client" // Helper for client-side motion
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function Home() {
  const t = await getTranslations("HomePage")

  const [articleCount, projectCount, recentArticles] = await Promise.all([
    prisma.article.count({ where: { published: true } }),
    prisma.project.count({ where: { featured: true } }),
    prisma.article.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        publishedAt: true,
        coverImage: true,
      }
    })
  ])

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background">
      {/* Dynamic Background */}
      <div className="fixed top-[-30%] right-[-10%] h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px] filter pointer-events-none" />
      <div className="fixed bottom-[-30%] left-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[120px] filter pointer-events-none" />

      {/* Hero Section */}
      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-4">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center gap-8 z-10"
        >
          {/* Badge */}
          <MotionDiv
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm"
          >
            <span className="mr-2">✨</span> {t("welcomeBadge")}
          </MotionDiv>

          {/* Main Title */}
          <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight md:text-7xl lg:text-8xl">
            {t("titlePart1")}{" "}
            <span className="relative inline-block">
              <span className="absolute -inset-2 block -skew-y-2 rounded-lg bg-primary/20" aria-hidden="true" />
              <span className="relative bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                {t("titlePart2")}
              </span>
            </span>
          </h1>

          {/* Description */}
          <p className="max-w-2xl text-xl text-muted-foreground md:text-2xl">
            {t("description")}
          </p>

          {/* Buttons */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link href="/articles">
              <Button size="lg" className="h-12 rounded-full px-8 text-base shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/30">
                {t("readArticles")} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/projects">
              <Button variant="outline" size="lg" className="h-12 rounded-full px-8 text-base backdrop-blur-sm transition-all hover:scale-105 hover:bg-primary/5">
                {t("viewProjects")}
              </Button>
            </Link>
          </MotionDiv>
        </MotionDiv>

        {/* Floating Elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

          {/* Existing Code Snippet Decoration */}
          <MotionDiv
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 0.4, x: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="absolute top-1/4 right-[5%] hidden lg:block"
          >
            <div className="rounded-xl border border-white/10 bg-card/10 p-4 backdrop-blur-md shadow-2xl skew-y-3">
              <div className="flex gap-2 mb-3">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
              </div>
              <div className="space-y-2 opacity-60">
                <div className="h-2 w-24 rounded-full bg-primary/30" />
                <div className="h-2 w-32 rounded-full bg-primary/20" />
                <div className="h-2 w-16 rounded-full bg-primary/30" />
                <div className="h-2 w-28 rounded-full bg-primary/20" />
              </div>
            </div>
          </MotionDiv>

          {/* Glassmorphism Stats Card */}
          <MotionDiv
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.8,
              duration: 1.5,
              ease: "easeOut"
            }}
            className="absolute top-[20%] left-[10%] hidden lg:block"
          >
            <MotionDiv
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]"
            >
              {/* Floating Badge */}
              <div className="absolute -top-3 -right-3 rounded-full bg-primary px-3 py-1 text-[10px] font-bold text-primary-foreground shadow-lg">
                LIVE
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <Icon icon="ph:activity-bold" width={20} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">System Status</div>
                  <div className="text-sm font-bold text-foreground">
                    {articleCount} Articles / {projectCount} Projects
                  </div>
                </div>
              </div>

              {/* Fake Chart */}
              <div className="flex items-end gap-1 h-16 w-48">
                {[40, 70, 45, 90, 60, 80, 50, 95].map((h, i) => (
                  <MotionDiv
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 1 + i * 0.1, duration: 0.5 }}
                    className="w-full rounded-t bg-gradient-to-t from-primary/10 to-primary/40"
                  />
                ))}
              </div>
            </MotionDiv>
          </MotionDiv>
        </div>
      </div>

      {/* Latest Articles Section */}
      {recentArticles.length > 0 && (
        <div className="container mx-auto max-w-5xl px-4 pb-24 z-10 relative">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Latest Articles</h2>
            <Link href="/articles">
              <Button variant="ghost" className="gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentArticles.map((article: any, index: number) => (
              <MotionDiv
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                // whileInView={{ opacity: 1, y: 0 }} // requires client comp, skipping for server comp loop or using wrapper
                // Just use animate on load for now, or assume below fold
                // Actually server comp cannot pass func to client. using style/className is safer.
                // But MotionDiv maps to motion.div.
                // Let's rely on simple CSS fade or no animation for now for list items to avoid hydration mismatch if not careful.
                // Or just use standard div.
                className="flex flex-col"
              >
                <Link href={`/articles/${article.slug}`} className="group h-full">
                  <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50 flex flex-col">
                    {article.coverImage && (
                      <div className="h-40 w-full overflow-hidden bg-muted">
                        <img src={article.coverImage} alt={article.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">{article.title}</CardTitle>
                        <Badge variant="secondary" className="font-normal text-xs shrink-0">
                          {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Draft'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-sm text-muted-foreground line-clamp-2">{article.description}</p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <div className="text-xs font-medium text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                        Read Article <Icon icon="ph:arrow-right" />
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              </MotionDiv>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
