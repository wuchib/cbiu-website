import { Icon } from "@iconify/react"
import { Link } from "@/i18n/routing"
import { getTranslations } from "next-intl/server"
import * as Motion from "@/components/motion-client" // Helper for client-side motion
import { prisma } from "@/lib/prisma"

export default async function SharePage() {
  const t = await getTranslations("Share")

  const categories = await prisma.shareCategory.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      resources: {
        orderBy: { order: 'asc' }
      }
    }
  })

  return (
    <div className="container relative mx-auto min-h-screen max-w-5xl px-4 py-24">
      {/* Background Element */}
      <div className="fixed top-0 right-0 -z-10 h-[500px] w-[500px] bg-primary/5 blur-[100px] rounded-full opacity-50 pointer-events-none" />

      <div className="relative z-10">
        <div className="mb-16 space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
          <p className="max-w-2xl text-lg text-muted-foreground">{t("description")}</p>
        </div>

        <div className="space-y-16">
          {categories.map((category) => {
            // Skip categories with no resources if desired, or keep them to show empty state?
            // Let's hide if empty? Or keep? existing logic showed everything.
            if (category.resources.length === 0) return null;

            return (
              <section key={category.key} className="relative">
                {/* Category Header */}
                <div className="mb-6 flex items-center gap-3 border-b border-border/50 pb-4">
                  <div className={`p-2 rounded-lg bg-background border border-border/50 ${category.color || 'text-primary'}`}>
                    {category.icon && <Icon icon={category.icon} width={24} />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight">{category.name}</h2>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>

                {/* Resource List (Non-card) */}
                <div className="grid gap-1">
                  {category.resources.map((resource, i) => (
                    <Motion.div
                      key={resource.id}
                      initial={{ opacity: 0, x: -10 }}
                      // In SC we can't easily use whileInView with simple wrapper unless wrapper supports it.
                      // motion-client exports basic components. 
                      // Let's assume animate={{ opacity: 1, x: 0 }} for simple entry animation or just simple div if complex.
                      // Actually my motion-client wrapper exposes components that ARE motion components, so props work!
                      // But "viewport" prop might need client side observation.
                      // Let's try simple animate on load.
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={resource.link}
                        target="_blank"
                        className="group flex flex-col sm:flex-row sm:items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/40"
                      >
                        {/* Icon placeholder or Dot */}
                        <div className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/5 text-primary group-hover:scale-110 transition-transform">
                          {resource.iconName ? <Icon icon={resource.iconName} className="w-4 h-4" /> : (
                            <>
                              <Icon icon="ph:arrow-right" className="opacity-0 group-hover:opacity-100 transition-opacity w-4 h-4" />
                              <Icon icon="ph:hash" className="absolute opacity-50 group-hover:opacity-0 transition-opacity w-4 h-4" />
                            </>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 grid sm:grid-cols-[1fr_auto] gap-2 sm:items-center">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors">
                                {resource.title}
                              </h3>
                              {/* Tags (Tags not in DB yet) */}
                              {/* 
                              <div className="hidden sm:flex gap-1.5">
                                {resource.tags.map(tag => (
                                  <span key={tag} className="px-1.5 py-0.5 rounded-[4px] text-[9px] font-medium bg-primary/5 text-muted-foreground border border-primary/10 opacity-70">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              */}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                              {resource.description}
                            </p>
                          </div>
                        </div>

                        <div className="hidden sm:flex items-center gap-2 text-muted-foreground sm:text-transparent sm:group-hover:text-muted-foreground transition-colors">
                          <Icon icon="ph:arrow-up-right" className="w-4 h-4" />
                        </div>
                      </Link>
                    </Motion.div>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}
