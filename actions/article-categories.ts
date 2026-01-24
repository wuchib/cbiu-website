'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { ArticleCategory } from '@prisma/client'

// --- Article Categories ---

export async function getArticleCategories() {
  try {
    return await prisma.articleCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { articles: true }
        }
      }
    })
  } catch (error) {
    console.error('Error fetching article categories:', error)
    return []
  }
}

export async function createArticleCategory(data: Partial<ArticleCategory>) {
  try {
    if (!data.name || !data.slug) {
      return { error: 'Name and Slug are required' }
    }
    
    await prisma.articleCategory.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        color: data.color,
        sortOrder: data.sortOrder || 0
      }
    })
    revalidatePath('/admin/articles')
    return { success: true }
  } catch (error) {
    console.error('Error creating article category:', error)
    return { error: 'Failed to create category' }
  }
}

export async function updateArticleCategory(id: string, data: Partial<ArticleCategory>) {
  try {
    await prisma.articleCategory.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        color: data.color,
        sortOrder: data.sortOrder
      }
    })
    revalidatePath('/admin/articles')
    return { success: true }
  } catch (error) {
    console.error('Error updating article category:', error)
    return { error: 'Failed to update category' }
  }
}

export async function deleteArticleCategory(id: string) {
  try {
    // Check for articles in this category
    const count = await prisma.article.count({
      where: { categoryId: id }
    })

    if (count > 0) {
      return { error: 'Cannot delete category with existing articles' }
    }

    await prisma.articleCategory.delete({
      where: { id }
    })
    revalidatePath('/admin/articles')
    return { success: true }
  } catch (error) {
    console.error('Error deleting article category:', error)
    return { error: 'Failed to delete category' }
  }
}
