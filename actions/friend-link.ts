"use server"

import { prisma } from "@/lib/prisma"
import { FriendLink } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function getFriendLinks() {
  try {
    const links = await prisma.friendLink.findMany({
      orderBy: {
        sortOrder: "asc",
      },
    })
    return { success: true, data: links }
  } catch (error) {
    return { success: false, error: "Failed to fetch friend links" }
  }
}

export async function getFriendLink(id: string) {
  try {
    const link = await prisma.friendLink.findUnique({
      where: { id },
    })
    return { success: true, data: link }
  } catch (error) {
    return { success: false, error: "Failed to fetch friend link" }
  }
}

export async function createFriendLink(data: Omit<FriendLink, "id" | "createdAt" | "updatedAt">) {
  try {
    const link = await prisma.friendLink.create({
      data,
    })
    revalidatePath("/admin/friends")
    revalidatePath("/")
    return { success: true, data: link }
  } catch (error) {
    return { success: false, error: "Failed to create friend link" }
  }
}

export async function updateFriendLink(id: string, data: Partial<FriendLink>) {
  try {
    const link = await prisma.friendLink.update({
      where: { id },
      data,
    })
    revalidatePath("/admin/friends")
    revalidatePath("/")
    return { success: true, data: link }
  } catch (error) {
    return { success: false, error: "Failed to update friend link" }
  }
}

export async function deleteFriendLink(id: string) {
  try {
    await prisma.friendLink.delete({
      where: { id },
    })
    revalidatePath("/admin/friends")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to delete friend link" }
  }
}
