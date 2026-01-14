"use client"

import * as React from "react"
import { useLocale } from "next-intl"
import { usePathname, useRouter } from "@/i18n/routing"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react"

export function LanguageToggle() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="group h-8 w-8 rounded-full">
          <Icon
            icon="ph:translate-bold"
            className="h-4 w-4 transition-transform group-hover:rotate-12"
          />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => switchLocale("en")}>
          <span className="mr-2">🇺🇸</span> English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchLocale("zh")}>
          <span className="mr-2">🇨🇳</span> 中文
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
