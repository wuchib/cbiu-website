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
  const tNav = await getTranslations("Navigation")

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
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background font-sans selection:bg-primary/20">

      {/* Background Layer */}
      <div className="fixed inset-0 z-[-1] h-full w-full bg-background">
        {/* Radial Gradient for focus */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_-10%,#3b82f615,transparent)] dark:bg-[radial-gradient(circle_500px_at_50%_-10%,#3b82f60d,transparent)]" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative mx-auto flex min-h-[90vh] max-w-5xl flex-col justify-center px-4 pt-20">
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="flex flex-col items-center text-center gap-8 z-10"
        >
          {/* Badge */}
          <MotionDiv
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="group relative inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/50 px-4 py-1.5 text-sm font-medium text-foreground backdrop-blur-md transition-colors hover:bg-primary/5 hover:border-primary/30"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span>{t("welcomeBadge")}</span>
          </MotionDiv>

          {/* Main Title */}
          <h1 className="max-w-4xl text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl text-balance bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 pb-2">
            {t("titlePart1")}{" "}
            <span className="text-primary decoration-primary/30 underline-offset-8 decoration-4">
              {t("titlePart2")}
            </span>
          </h1>

          {/* Description */}
          <p className="max-w-2xl text-lg text-muted-foreground/80 md:text-xl leading-relaxed">
            {t("description")}
          </p>

          {/* Buttons */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 mt-4"
          >
            <Link href="/articles">
              <Button size="lg" className="h-12 rounded-full px-8 text-base font-medium shadow-xl shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/40 active:scale-95">
                {t("readArticles")}
              </Button>
            </Link>
            <Link href="/projects">
              <Button variant="outline" size="lg" className="h-12 rounded-full px-8 text-base border-primary/20 bg-background/50 backdrop-blur-sm transition-all hover:bg-primary/5 hover:border-primary/40">
                {t("viewProjects")}
              </Button>
            </Link>
          </MotionDiv>

          {/* System Status - Minimalist Bar */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex items-center gap-6 rounded-full border border-primary/5 bg-secondary/30 px-6 py-2 text-xs font-medium text-muted-foreground backdrop-blur-sm"
          >
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="font-semibold text-foreground/80">{t("live")}</span>
            </div>
            <div className="h-3 w-px bg-border/50" />
            <div className="flex items-center gap-1">
              <Icon icon="ph:article-bold" className="h-3.5 w-3.5 opacity-70" />
              <span>{articleCount} {tNav("articles")}</span>
            </div>
            <div className="h-3 w-px bg-border/50" />
            <div className="flex items-center gap-1">
              <Icon icon="ph:code-bold" className="h-3.5 w-3.5 opacity-70" />
              <span>{projectCount} {tNav("projects")}</span>
            </div>
          </MotionDiv>
        </MotionDiv>

      </section>

      {/* Latest Articles Section */}
      {recentArticles.length > 0 && (
        <section className="container mx-auto max-w-5xl px-4 py-24 relative z-10">
          <div className="flex items-end justify-between mb-12 border-b border-border/40 pb-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{t("latestArticles")}</h2>
              <p className="text-muted-foreground mt-1 text-sm">Fresh from the digital garden.</p>
            </div>
            <Link href="/articles">
              <Button variant="link" className="group gap-1 text-muted-foreground hover:text-primary">
                {t("viewAll")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {recentArticles.map((article: any, index: number) => (
              <div
                key={article.id}
                className="group relative flex flex-col justify-between"
              >
                <Link href={`/articles/${article.slug}`} className="absolute inset-0 z-10" />

                {/* Image Container */}
                <div className="mb-4 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted border border-border/50 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-primary/5">
                  {article.coverImage ? (
                    <img src={article.coverImage} alt={article.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-secondary/30 text-muted-foreground/20">
                      <Icon icon="ph:article-medium" className="h-12 w-12" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <time dateTime={article.publishedAt?.toString()} className="font-mono">
                      {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : t("draft")}
                    </time>
                  </div>
                  <h3 className="line-clamp-2 text-xl font-bold leading-tight tracking-tight group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="line-clamp-2 text-muted-foreground text-sm">
                    {article.description}
                  </p>
                </div>

                {/* Minimalist Action */}
                <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                  {t("readArticle")} <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  )
}
