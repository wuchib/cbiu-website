"use client"

import { useEffect, useState } from "react"
import { Icon } from "@iconify/react"
import { useTranslations } from "next-intl"

export function WelcomeHeader() {
  const t = useTranslations('Admin.dashboard.welcome')
  const [greeting, setGreeting] = useState("")
  const [dateStr, setDateStr] = useState("")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting(t('morning'))
    else if (hour < 18) setGreeting(t('afternoon'))
    else setGreeting(t('evening'))

    setDateStr(new Date().toLocaleDateString("en-US", { // TODO: Adapt date locale?
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }))
  }, [t])

  if (!greeting) return <div className="h-20" />

  return (
    <div className="flex flex-col gap-1 mb-8">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon icon="ph:calendar-blank-duotone" className="w-4 h-4" />
        <span className="text-sm font-medium">{dateStr}</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight">
        {greeting}, Admin!
      </h1>
      <p className="text-muted-foreground">
        {t('subtitle')}
      </p>
    </div>
  )
}
