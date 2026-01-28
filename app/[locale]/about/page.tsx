import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react"
import Link from "next/link"

export default function AboutPage() {
  const techStack = [
    { name: "Vue", icon: "simple-icons:vuedotjs", color: "text-green-500" },
    { name: "React", icon: "simple-icons:react", color: "text-blue-500" },
    { name: "TypeScript", icon: "simple-icons:typescript", color: "text-blue-600" },
    { name: "Tailwind CSS", icon: "simple-icons:tailwindcss", color: "text-cyan-500" },
  ]

  return (
    <div className="container relative mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-4 py-12">
      {/* Main Card */}
      <div className="w-full overflow-hidden rounded-3xl border border-border/50 bg-card/30 backdrop-blur-md">

        {/* Avatar Section - Prominent */}
        <div className="flex flex-col items-center justify-center pt-16 pb-8">
          <div className="group relative">
            {/* Decorative Ring */}
            <div className="absolute inset-0 -m-2 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 blur-xl transition-all group-hover:scale-110" />

            {/* Avatar */}
            <Avatar className="relative h-32 w-32 border-4 border-background shadow-2xl transition-transform group-hover:scale-105 md:h-40 md:w-40">
              <AvatarImage src="/avatar.jpg" alt="Cbiu" className="object-cover" />
              <AvatarFallback className="text-4xl">CB</AvatarFallback>
            </Avatar>
          </div>

          {/* Name */}
          <h1 className="mt-8 text-4xl font-bold tracking-tight md:text-5xl">
            Cbiu
          </h1>

          {/* Bio */}
          <p className="mt-4 text-center text-lg text-muted-foreground max-w-md px-6 md:text-xl">
            💻 啥都想学，希望成为优秀的开发者、产品工程师。
          </p>

          {/* GitHub Link */}
          <Link
            href="https://github.com/wuchib"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8"
          >
            <Button
              variant="outline"
              size="lg"
              className="group h-12 rounded-full border-2 px-8 transition-all hover:border-primary hover:bg-primary/5"
            >
              <Icon icon="mdi:github" className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
              <span className="font-medium">GitHub</span>
              <Icon icon="ph:arrow-up-right-bold" className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Button>
          </Link>
        </div>

        {/* Tech Stack Section */}
        <div className="border-t border-border/50 bg-muted/20 px-8 py-10 md:px-12">
          <h2 className="mb-6 text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            技术栈
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-6">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="group flex flex-col items-center gap-2 transition-transform hover:scale-110"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background shadow-sm transition-all group-hover:shadow-md">
                  <Icon
                    icon={tech.icon}
                    className={`h-7 w-7 transition-colors ${tech.color} group-hover:opacity-100 opacity-80`}
                  />
                </div>
                <span className="text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <p className="mt-8 text-center text-sm text-muted-foreground/60">
        持续学习，不断进步
      </p>
    </div>
  )
}
