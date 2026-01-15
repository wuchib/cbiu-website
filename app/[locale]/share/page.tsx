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
                    {category.icon && <Icon icon={category.icon} width={20} />}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight">{category.name}</h2>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>

                {/* Resource Grid */}
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {category.resources.map((resource, i) => (
                    <Motion.div
                      key={resource.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="h-full"
                    >
                      <Link
                        href={resource.link}
                        target="_blank"
                        className="group flex items-center gap-3 h-full p-3 rounded-xl border border-border/40 bg-card/30 hover:bg-card hover:border-border transition-all hover:shadow-sm"
                      >
                        <div className="shrink-0 p-2 rounded-md bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                          {resource.iconName ? (
                            <Icon icon={resource.iconName} className="w-4 h-4" />
                          ) : (
                            <Icon icon="ph:hash" className="w-4 h-4" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate">
                            {resource.title}
                          </h3>
                          <p className="text-xs text-muted-foreground truncate opacity-80">
                            {resource.description}
                          </p>
                        </div>

                        <Icon icon="ph:arrow-up-right" className="shrink-0 w-3.5 h-3.5 text-muted-foreground opacity-20 group-hover:opacity-100 group-hover:text-primary transition-all -ml-1" />
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
