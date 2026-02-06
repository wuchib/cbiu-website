'use server'

import { prisma } from '@/lib/prisma'

// 记录访客
export async function recordVisit(data: {
  path: string
  ip?: string
  userAgent?: string
  referer?: string
  country?: string
}) {
  try {
    await prisma.visitor.create({
      data: {
        path: data.path,
        ip: data.ip,
        userAgent: data.userAgent,
        referer: data.referer,
        country: data.country,
      }
    })
    return { success: true }
  } catch (error) {
    console.error('Failed to record visit:', error)
    return { success: false }
  }
}

// 获取访客列表（分页）
export async function getVisitors(page: number = 1, pageSize: number = 20) {
  const skip = (page - 1) * pageSize

  const [visitors, total] = await Promise.all([
    prisma.visitor.findMany({
      orderBy: { createdAt: 'desc' },
      take: pageSize,
      skip,
    }),
    prisma.visitor.count()
  ])

  return {
    visitors,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  }
}

// 获取访客统计
export async function getVisitorStats() {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const [todayCount, totalCount] = await Promise.all([
    prisma.visitor.count({
      where: {
        createdAt: { gte: todayStart }
      }
    }),
    prisma.visitor.count()
  ])

  return {
    today: todayCount,
    total: totalCount
  }
}
