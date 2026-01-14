"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icon } from "@iconify/react"

const themes = [
  { name: "Violet", class: "theme-violet", color: "hsl(262.1 83.3% 57.8%)" },
  { name: "Blue", class: "theme-blue", color: "hsl(221.2 83.2% 53.3%)" },
  { name: "Cyan", class: "theme-cyan", color: "hsl(189 94% 43%)" },
  { name: "Teal", class: "theme-teal", color: "hsl(173 80% 40%)" },
  { name: "Green", class: "theme-green", color: "hsl(142.1 76.2% 36.3%)" },
  { name: "Yellow", class: "theme-yellow", color: "hsl(45 93% 47%)" },
  { name: "Orange", class: "theme-orange", color: "hsl(24.6 95% 53.1%)" },
  { name: "Red", class: "theme-red", color: "hsl(0 72% 51%)" },
  { name: "Rose", class: "theme-rose", color: "hsl(346.8 77.2% 49.8%)" },
  { name: "Indigo", class: "theme-indigo", color: "hsl(239 84% 67%)" },
]

export function ThemeCustomizer() {
  const [mounted, setMounted] = React.useState(false)
  const [activeTheme, setActiveTheme] = React.useState("theme-violet")

  React.useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("theme-color")
    if (savedTheme) {
      setActiveTheme(savedTheme)
      document.body.classList.add(savedTheme)
    } else {
      document.body.classList.add("theme-violet")
    }
  }, [])

  const setTheme = (themeClass: string) => {
    // Remove all theme classes
    themes.forEach((t) => document.body.classList.remove(t.class))
    // Add new theme class
    document.body.classList.add(themeClass)
    // Save to state and local storage
    setActiveTheme(themeClass)
    localStorage.setItem("theme-color", themeClass)
  }

  if (!mounted) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="group h-8 w-8 rounded-full">
          <Icon
            icon="ph:palette-bold"
            className="h-4 w-4 transition-transform group-hover:rotate-12"
          />
          <span className="sr-only">Toggle theme color</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <div className="grid grid-cols-5 gap-1 p-1">
          {themes.map((theme) => (
            <DropdownMenuItem
              key={theme.name}
              onClick={() => setTheme(theme.class)}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full p-0 transition-all hover:scale-105 focus:scale-105 active:scale-95"
            >
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full border border-black/10 shadow-sm dark:border-white/10"
                style={{ backgroundColor: theme.color }}
              >
                {activeTheme === theme.class && (
                  <Check className="h-3 w-3 text-white" />
                )}
              </span>
              <span className="sr-only">{theme.name}</span>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
