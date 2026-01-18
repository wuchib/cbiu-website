'use server'

import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File
  if (!file) {
    return { error: 'NO_FILE' }
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    return { error: 'INVALID_TYPE' }
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Validate file size (Max 5MB)
  if (buffer.byteLength > 5 * 1024 * 1024) {
      return { error: 'FILE_TOO_LARGE' }
  }

  const uploadDir = join(process.cwd(), 'public', 'uploads')
  
  try {
    await mkdir(uploadDir, { recursive: true })
  } catch (e) {
    console.error('Error creating upload directory:', e)
    return { error: 'SAVE_FAILED' }
  }

  // Generate unique filename
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
  const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, '')
  const filename = `${uniqueSuffix}-${originalName}`
  const filepath = join(uploadDir, filename)

  try {
    await writeFile(filepath, buffer)
    return { url: `/uploads/${filename}` }
  } catch (e) {
    console.error('Error saving file:', e)
    return { error: 'SAVE_FAILED' }
  }
}
