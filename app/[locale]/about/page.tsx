import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Icon } from "@iconify/react"
import { useTranslations } from "next-intl"

export default function AboutPage() {
  const t = useTranslations("About")

  return (
    <div className="container relative mx-auto min-h-screen max-w-5xl px-4 py-24">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2 h-full">

        {/* Profile Card - Large Left */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/50 bg-card/50 p-8 md:col-span-2 md:row-span-2 backdrop-blur-sm transition-all hover:bg-card/80">
          <div className="absolute right-0 top-0 -z-10 opacity-10">
            <Icon icon="ph:sketch-logo-duotone" width={300} height={300} className="translate-x-1/3 -translate-y-1/3 rotate-12 text-primary" />
          </div>

          <div>
            <div className="mb-6 inline-block rounded-full border border-primary/20 bg-primary/10 p-1">
              <Avatar className="h-20 w-20 border-2 border-background">
                <AvatarImage src="https://github.com/shadcn.png" alt="@cbiu" />
                <AvatarFallback>CB</AvatarFallback>
              </Avatar>
            </div>

            <h1 className="mb-2 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
              Hello, I&apos;m <span className="text-primary">CBIU</span>
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              {t("description")}
            </p>
          </div>

          <div className="mt-12 space-y-4">
            <div className="flex flex-wrap gap-2">
              {["Frontend Engineer", "Open Source", "UI/UX Enthusiast", "Minimalist"].map((tag) => (
                <span key={tag} className="inline-flex items-center rounded-full border border-border bg-background/50 px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Social Card - Top Right */}
        <div className="group relative flex flex-col justify-center overflow-hidden rounded-3xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all hover:bg-card/80">
          <div className="absolute right-4 top-4 opacity-20 transition-opacity group-hover:opacity-40">
            <Icon icon="ph:arrow-up-right-bold" className="h-6 w-6" />
          </div>
          <h3 className="mb-4 text-lg font-semibold text-muted-foreground">Connect</h3>
          <div className="flex gap-4">
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-2 hover:border-primary hover:text-primary">
              <Icon icon="mdi:github" className="h-6 w-6" />
            </Button>
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-2 hover:border-primary hover:text-primary">
              <Icon icon="mdi:twitter" className="h-6 w-6" />
            </Button>
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-2 hover:border-primary hover:text-primary">
              <Icon icon="mdi:email" className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Stack Card - Bottom Right */}
        <div className="group relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-primary/5 to-transparent p-6 backdrop-blur-sm transition-all hover:from-primary/10">
          <h3 className="mb-4 text-lg font-semibold text-muted-foreground">Tech Stack</h3>
          <div className="grid grid-cols-4 gap-4">
            {["react", "nextjs", "typescript", "tailwindcss", "nodedotjs", "postgresql", "figma", "git"].map((tech) => (
              <div key={tech} className="flex h-10 w-10 items-center justify-center rounded-lg bg-background shadow-sm transition-transform group-hover:scale-110">
                <Icon icon={`simple-icons:${tech.replace("nextjs", "nextdotjs")}`} className="h-5 w-5 text-foreground/80" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
