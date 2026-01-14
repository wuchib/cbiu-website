'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { redirect } from "next/navigation"

const ProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required")
      .regex(/^[a-z0-9-]+$/, "Slug must be lowercase, numbers, and hyphens only"),
  description: z.string().min(1, "Description is required"),
  content: z.string().optional(),
  thumbnail: z.string().optional(),
  demoUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  featured: z.coerce.boolean(),
  order: z.string().transform(val => parseInt(val, 10)).optional(), 
})

export async function createProject(prevState: any, formData: FormData) {
  const validatedFields = ProjectSchema.safeParse({
    title: formData.get('title'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    content: formData.get('content'),
    thumbnail: formData.get('thumbnail'),
    demoUrl: formData.get('demoUrl'),
    githubUrl: formData.get('githubUrl'),
    featured: formData.get('featured') === 'on',
    order: formData.get('order') || "0",
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Project.',
    }
  }

  const { title, slug, description, content, thumbnail, demoUrl, githubUrl, featured, order } = validatedFields.data

  try {
     // Check slug
     const existing = await prisma.project.findUnique({ where: { slug } })
     if (existing) {
         return {
             errors: { slug: ['Slug must be unique.'] },
             message: 'Slug already exists.'
         }
     }

    await prisma.project.create({
      data: {
        title,
        slug,
        description,
        content,
        thumbnail,
        demoUrl: demoUrl || null,
        githubUrl: githubUrl || null,
        featured,
        order: order || 0,
      },
    })
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Project.',
    }
  }

  revalidatePath('/admin/projects')
  revalidatePath('/projects')
  redirect('/admin/projects')
}

export async function updateProject(id: string, prevState: any, formData: FormData) {
    const validatedFields = ProjectSchema.safeParse({
      title: formData.get('title'),
      slug: formData.get('slug'),
      description: formData.get('description'),
      content: formData.get('content'),
      thumbnail: formData.get('thumbnail'),
      demoUrl: formData.get('demoUrl'),
      githubUrl: formData.get('githubUrl'),
      featured: formData.get('featured') === 'on',
      order: formData.get('order') || "0",
    })
  
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Update Project.',
      }
    }
  
    const { title, slug, description, content, thumbnail, demoUrl, githubUrl, featured, order } = validatedFields.data
  
    try {
        const existing = await prisma.project.findUnique({ where: { slug } })
        if (existing && existing.id !== id) {
            return {
                errors: { slug: ['Slug must be unique.'] },
                message: 'Slug already exists.'
            }
        }

      await prisma.project.update({
        where: { id },
        data: {
          title,
          slug,
          description,
          content,
          thumbnail,
          demoUrl: demoUrl || null,
          githubUrl: githubUrl || null,
          featured,
          order: order || 0,
        },
      })
    } catch (error) {
      return {
        message: 'Database Error: Failed to Update Project.',
      }
    }
  
    revalidatePath('/admin/projects')
    revalidatePath('/projects')
    redirect('/admin/projects')
  }

export async function deleteProject(id: string) {
  try {
    await prisma.project.delete({
      where: { id },
    })
    revalidatePath('/admin/projects')
    return { message: 'Deleted Project' }
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Project.' }
  }
}
