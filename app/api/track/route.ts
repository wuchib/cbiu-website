import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { path, referer } = body

    // 获取 IP 地址
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || undefined

    // 获取 User Agent
    const userAgent = request.headers.get('user-agent') || undefined

    // 过滤掉不需要记录的路径
    const excludedPaths = ['/api/', '/admin/', '/_next/', '/favicon']
    if (excludedPaths.some(excluded => path.startsWith(excluded))) {
      return NextResponse.json({ success: true, skipped: true })
    }

    await prisma.visitor.create({
      data: {
        path,
        ip,
        userAgent,
        referer: referer || undefined,
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to track visit:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
