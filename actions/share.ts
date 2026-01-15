'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const ShareSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  link: z.string().url("Must be a valid URL"),
  categoryKey: z.string().min(1, "Category is required"),
  iconName: z.string().optional(),
})

export async function createShareResource(prevState: any, formData: FormData) {
  const validatedFields = ShareSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    link: formData.get('link'),
    categoryKey: formData.get('categoryKey'),
    iconName: formData.get('iconName'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Resource.',
    }
  }

  const { title, description, link, categoryKey, iconName } = validatedFields.data

  try {
    await prisma.shareResource.create({
      data: {
        title,
        description,
        link,
        categoryKey,
        iconName,
        order: 0, // Default order
      },
    })
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Resource.',
    }
  }

  revalidatePath('/admin/share')
  revalidatePath('/share')
  return { message: 'Created Resource' }
}

export async function deleteShareResource(id: string) {
  try {
    await prisma.shareResource.delete({
      where: { id },
    })
    revalidatePath('/admin/share')
    revalidatePath('/share')
    return { message: 'Deleted Resource' }
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Resource.' }
  }
}

export async function updateShareResource(id: string, prevState: any, formData: FormData) {
    const validatedFields = ShareSchema.safeParse({
      title: formData.get('title'),
      description: formData.get('description'),
      link: formData.get('link'),
      categoryKey: formData.get('categoryKey'),
      iconName: formData.get('iconName'),
    })
  
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Update Resource.',
      }
    }
  
    const { title, description, link, categoryKey, iconName } = validatedFields.data
  
    try {
      await prisma.shareResource.update({
        where: { id },
        data: {
          title,
          description,
          link,
          categoryKey,
          iconName,
        },
      })
    } catch (error) {
      return {
        message: 'Database Error: Failed to Update Resource.',
      }
    }
  
    revalidatePath('/admin/share')
    revalidatePath('/share')
    return { message: 'Updated Resource' }
}

export async function fetchRepoInfo(url: string) {
  try {
    const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;
    
    // GitHub
    if (cleanUrl.includes('github.com')) {
      const match = cleanUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (match) {
        const [_, owner, repo] = match;
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
        if (!res.ok) throw new Error('Failed to fetch GitHub repo');
        const data = await res.json();
        return {
           success: true,
           data: {
             title: data.name,
             description: data.description || '',
             iconName: 'mdi:github',
           }
        }
      }
    }

    // Gitee
    if (cleanUrl.includes('gitee.com')) {
      const match = cleanUrl.match(/gitee\.com\/([^/]+)\/([^/]+)/);
      if (match) {
        const [_, owner, repo] = match;
        const res = await fetch(`https://gitee.com/api/v5/repos/${owner}/${repo}`);
        if (!res.ok) throw new Error('Failed to fetch Gitee repo');
        const data = await res.json();
        return {
           success: true,
           data: {
             title: data.name,
             description: data.description || '',
             iconName: 'simple-icons:gitee',
           }
        }
      }
    }

    return { success: false, message: 'Not a supported repository URL (GitHub/Gitee)' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to fetch repository info' };
  }
}
