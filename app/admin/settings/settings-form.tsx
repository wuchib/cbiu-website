"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { updateGlobalSettings } from "@/actions/settings"
import { Icon } from "@iconify/react"

interface SettingsFormProps {
  initialSettings: Record<string, string>
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  // Define our config fields
  const [pageWidth, setPageWidth] = React.useState(initialSettings["pageWidth"] || "1200")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const result = await updateGlobalSettings({
        pageWidth,
      })
      if (result.success) {
        toast.success("Settings saved successfully")
        router.refresh()
      } else {
        toast.error("Failed to save settings")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize the look and feel of the public website.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pageWidth">Page Content Width (px)</Label>
            <Input
              id="pageWidth"
              type="number"
              value={pageWidth}
              onChange={(e) => setPageWidth(e.target.value)}
              placeholder="1200"
              className="max-w-xs"
            />
            <p className="text-[13px] text-muted-foreground mt-1">
              Set the maximum width of the main content area (default: 1200). Note: only applies to large screens.
            </p>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button type="submit" disabled={isPending} className="gap-2">
            {isPending && <Icon icon="lucide:loader-2" className="h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
