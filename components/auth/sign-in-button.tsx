'use client'

import { signIn } from 'next-auth/react'
import { Icon } from '@iconify/react'

export function SignInButton() {
  return (
    <button
      onClick={() => signIn('google', { callbackUrl: '/' })}
      className="flex w-full items-center gap-2 rounded-md text-[12px] text-[#5C5147] hover:bg-[#E8DDD0] hover:text-[#2C2520] transition-colors"
    >
      <Icon icon="mdi:google" className="h-4 w-4 text-[#8B7E74]" />
      <span>使用 Google 登录</span>
    </button>
  )
}
