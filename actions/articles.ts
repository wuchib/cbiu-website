'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { redirect } from "next/navigation"

// Helper to slugify tags
function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

// Schema for validation
const ArticleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase, numbers, and hyphens only"),
  description: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().optional(),
  published: z.coerce.boolean(),
  tags: z.string().optional(), // Received as JSON string
  categoryId: z.string().optional(),
})

export async function createArticle(prevState: any, formData: FormData) {
  const validatedFields = ArticleSchema.safeParse({
    title: formData.get('title'),
    slug: formData.get('slug'),
    description: formData.get('description') || undefined,
    content: formData.get('content'),
    coverImage: formData.get('coverImage') || undefined,
    published: formData.get('published') === 'on',
    tags: formData.get('tags') || undefined,
    categoryId: formData.get('categoryId') || undefined,
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Article.',
    }
  }

  const { title, slug, description, content, coverImage, published, tags, categoryId } = validatedFields.data
  
  const tagsList: string[] = tags ? JSON.parse(tags) : [];

  try {
    // Check for unique slug
    const existing = await prisma.article.findUnique({ where: { slug } })
    if (existing) {
        return {
            errors: { slug: ['Slug must be unique. This one is already taken.'] },
            message: 'Slug already exists.'
        }
    }

    await prisma.article.create({
      data: {
        title,
        slug,
        description,
        content,
        coverImage,
        published,
        publishedAt: published ? new Date() : null,
        categoryId: categoryId || null,
        tags: {
            create: tagsList.map(tag => ({
                tag: {
                    connectOrCreate: {
                        where: { slug: slugify(tag) },
                        create: { name: tag, slug: slugify(tag) }
                    }
                }
            }))
        }
      },
    })
  } catch (error) {
    console.error(error)
    return {
      message: 'Database Error: Failed to Create Article.',
    }
  }

  revalidatePath('/admin/articles')
  revalidatePath('/blog')
  redirect('/admin/articles')
}

export async function updateArticle(id: string, prevState: any, formData: FormData) {
  const validatedFields = ArticleSchema.safeParse({
    title: formData.get('title'),
    slug: formData.get('slug'),
    description: formData.get('description') || undefined,
    content: formData.get('content'),
    coverImage: formData.get('coverImage') || undefined,
    published: formData.get('published') === 'on',
    tags: formData.get('tags') || undefined,
    categoryId: formData.get('categoryId') || undefined,
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Article.',
    }
  }

  const { title, slug, description, content, coverImage, published, tags, categoryId } = validatedFields.data
  const tagsList: string[] = tags ? JSON.parse(tags) : [];

  try {
     const existing = await prisma.article.findUnique({ where: { slug } })
     if (existing && existing.id !== id) {
         return {
             errors: { slug: ['Slug must be unique. This one is already taken.'] },
             message: 'Slug already exists.'
         }
     }

    await prisma.article.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        content,
        coverImage,
        published,
        publishedAt: published ? (existing?.published ? existing.publishedAt : new Date()) : null,
        categoryId: categoryId || null,
        tags: {
            deleteMany: {}, // Remove existing relations
            create: tagsList.map(tag => ({
                tag: {
                    connectOrCreate: {
                        where: { slug: slugify(tag) },
                        create: { name: tag, slug: slugify(tag) }
                    }
                }
            }))
        }
      },
    })
  } catch (error) {
    console.error(error)
    return {
      message: 'Database Error: Failed to Update Article.',
    }
  }

  revalidatePath('/admin/articles')
  revalidatePath('/blog')
  redirect('/admin/articles')
}

export async function deleteArticle(id: string) {
  try {
    await prisma.article.delete({
      where: { id },
    })
    revalidatePath('/admin/articles')
    revalidatePath('/blog')
    return { message: 'Deleted Article' }
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Article.' }
  }
}

export async function togglePublishArticle(id: string, currentState: boolean) {
    try {
        await prisma.article.update({
            where: { id },
            data: { 
                published: !currentState,
                publishedAt: !currentState ? new Date() : null 
            }
        })
        revalidatePath('/admin/articles')
        return { message: 'Updated Status' }
    } catch (error) {
        return { message: 'Failed to update status' }
    }
}

export async function getPublicArticles(page = 1, limit = 12) {
  try {
    const skip = (page - 1) * limit
    
    // We only want published articles
    const where = { published: true }

    const [total, articles] = await Promise.all([
      prisma.article.count({ where }),
      prisma.article.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          publishedAt: true,
          coverImage: true,
        }
      })
    ])

    const formattedArticles = articles.map(article => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      description: article.description,
      date: article.publishedAt ? article.publishedAt.toISOString() : new Date().toISOString(),
      cover: article.coverImage,
      tags: [], // Could join tags if needed
    }))

    return {
      success: true,
      data: formattedArticles,
      total,
      hasMore: skip + limit < total
    }
  } catch (error) {
    console.error('Fetch Public Articles Error:', error)
    return { success: false, data: [], total: 0, hasMore: false }
  }
}
