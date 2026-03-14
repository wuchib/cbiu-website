"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getGlobalSettings() {
  const settings = await prisma.globalSetting.findMany()
  const result: Record<string, string> = {}
  settings.forEach((s) => {
    result[s.key] = s.value
  })
  return result
}

export async function updateGlobalSettings(data: Record<string, string>) {
  try {
    for (const [key, value] of Object.entries(data)) {
      await prisma.globalSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    }
    revalidatePath("/")
    revalidatePath("/admin/settings")
    return { success: true }
  } catch (error) {
    console.error("Failed to update settings:", error)
    return { success: false, error: "Failed to update settings" }
  }
}
