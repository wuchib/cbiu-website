'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const TodoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.coerce.number().min(0).max(3).default(0),
  sortOrder: z.coerce.number().optional().default(0),
})

export async function getTodos(status?: number) {
  try {
    const where = status !== undefined ? { status } : {}
    return await prisma.todo.findMany({
      where,
      orderBy: [
        { status: 'asc' },
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    })
  } catch (error) {
    console.error('Fetch Todos Error:', error)
    return []
  }
}

export async function createTodo(prevState: any, formData: FormData) {
  const validatedFields = TodoSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description')?.toString() || '',
    status: formData.get('status') || "0",
    sortOrder: formData.get('sortOrder') || "0",
  })

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Todo.',
    }
  }

  const { title, description, status, sortOrder } = validatedFields.data

  try {
    await prisma.todo.create({
      data: {
        title,
        description,
        status,
        sortOrder,
      },
    })
  } catch (error) {
    console.error('Create Todo Error:', error);
    return {
      success: false,
      message: 'Database Error: Failed to Create Todo.',
    }
  }
  
  revalidatePath('/admin/todo')
  revalidatePath('/todo')
  return { success: true, message: 'Created Todo' }
}

export async function updateTodo(id: string, prevState: any, formData: FormData) {
  const validatedFields = TodoSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description')?.toString() || '',
    status: formData.get('status') || "0",
    sortOrder: formData.get('sortOrder') || "0",
  })

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Todo.',
    }
  }

  const { title, description, status, sortOrder } = validatedFields.data

  try {
    await prisma.todo.update({
      where: { id },
      data: {
        title,
        description,
        status,
        sortOrder,
      },
    })
  } catch (error) {
    console.error('Update Todo Error:', error);
    return {
      success: false,
      message: 'Database Error: Failed to Update Todo.',
    }
  }

  revalidatePath('/admin/todo')
  revalidatePath('/todo')
  return { success: true, message: 'Updated Todo' }
}

export async function toggleTodoStatus(id: string, newStatus: number) {
  try {
    await prisma.todo.update({
      where: { id },
      data: { status: newStatus },
    })
    revalidatePath('/admin/todo')
    revalidatePath('/todo')
    return { success: true, message: 'Updated Todo Status' }
  } catch (error) {
    return { success: false, message: 'Database Error: Failed to Update Status.' }
  }
}

export async function deleteTodo(id: string) {
  try {
    await prisma.todo.delete({
      where: { id },
    })
    revalidatePath('/admin/todo')
    revalidatePath('/todo')
    return { success: true, message: 'Deleted Todo' }
  } catch (error) {
    return { success: false, message: 'Database Error: Failed to Delete Todo.' }
  }
}
