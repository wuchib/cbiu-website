'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { ShareCategory, ShareResource } from '@prisma/client'

// --- Categories ---

export async function getShareCategories() {
  try {
    return await prisma.shareCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { resources: true }
        }
      }
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function createShareCategory(data: Partial<ShareCategory>) {
  try {
    if (!data.key || !data.name) return { error: 'Key and Name are required' }
    
    await prisma.shareCategory.create({
      data: {
        key: data.key,
        name: data.name,
        description: data.description,
        icon: data.icon,
        color: data.color,
        sortOrder: data.sortOrder,
        // @ts-ignore
        fieldsSchema: data.fieldsSchema as any
      }
    })
    revalidatePath('/admin/share')
    return { success: true }
  } catch (error) {
    console.error('Error creating category:', error)
    return { error: 'Failed to create category' }
  }
}

export async function updateShareCategory(key: string, data: Partial<ShareCategory>) {
  try {
    await prisma.shareCategory.update({
      where: { key },
      data: {
        name: data.name,
        description: data.description,
        icon: data.icon,
        color: data.color,
        sortOrder: data.sortOrder,
        // @ts-ignore
        fieldsSchema: data.fieldsSchema as any
      }
    })
    revalidatePath('/admin/share')
    return { success: true }
  } catch (error) {
    console.error('Error updating category:', error)
    return { error: 'Failed to update category' }
  }
}

export async function deleteShareCategory(key: string) {
  try {
    // Check for resources
    const count = await prisma.shareResource.count({
      where: { categoryKey: key }
    })

    if (count > 0) {
      return { error: 'Cannot delete category with existing resources' }
    }

    await prisma.shareCategory.delete({
      where: { key }
    })
    revalidatePath('/admin/share')
    return { success: true }
  } catch (error) {
    console.error('Error deleting category:', error)
    return { error: 'Failed to delete category' }
  }
}

// --- Resources ---

export async function getShareResources(categoryKey?: string) {
  try {
    const where = categoryKey ? { categoryKey } : {}
    return await prisma.shareResource.findMany({
      where,
      orderBy: { order: 'asc' },
      include: { category: true }
    })
  } catch (error) {
    console.error('Error fetching resources:', error)
    return []
  }
}

export async function createShareResource(data: any) {
  try {
    if (!data.categoryKey) {
      return { error: 'Category is required' }
    }

    await prisma.shareResource.create({
      data: {
        title: data.title,
        description: data.description,
        link: data.link,
        iconName: data.iconName,
        categoryKey: data.categoryKey,
        order: data.order,
        customData: data.customData
      }
    })
    revalidatePath('/admin/share')
    return { success: true }
  } catch (error) {
    console.error('Error creating resource:', error)
    return { error: 'Failed to create resource' }
  }
}

export async function updateShareResource(id: string, data: any) {
  try {
    await prisma.shareResource.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        link: data.link,
        iconName: data.iconName,
        categoryKey: data.categoryKey,
        order: data.order,
        customData: data.customData
      }
    })
    revalidatePath('/admin/share')
    return { success: true }
  } catch (error) {
    console.error('Error updating resource:', error)
    return { error: 'Failed to update resource' }
  }
}

export async function deleteShareResource(id: string) {
  try {
    await prisma.shareResource.delete({
      where: { id }
    })
    revalidatePath('/admin/share')
    return { success: true }
  } catch (error) {
    console.error('Error deleting resource:', error)
    return { error: 'Failed to delete resource' }
  }
}

export async function fetchRepoInfo(url: string) {
  try {
    const res = await fetch(url)
    if (!res.ok) return { success: false, message: 'Failed to fetch URL' }
    
    const html = await res.text()
    
    // Extract title
    const titleMatch = html.match(/<title>([^<]*)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim() : ''
    
    // Extract description
    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) ||
                      html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']*)["']/i)
    const description = descMatch ? descMatch[1].trim() : ''

    // Guess icon
    let iconName = ''
    if (url.includes('github.com')) iconName = 'mdi:github'
    else if (url.includes('glitch.me')) iconName = 'simple-icons:glitch'
    else if (url.includes('vercel.app')) iconName = 'simple-icons:vercel'

    return {
      success: true,
      data: {
        title,
        description,
        iconName
      }
    }
  } catch (error) {
    return { success: false, message: 'Error fetching URL' }
  }
}
