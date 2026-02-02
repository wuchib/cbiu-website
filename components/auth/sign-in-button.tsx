'use client'

import { signIn } from 'next-auth/react'
import { Icon } from '@iconify/react'

export function SignInButton() {
  return (
    <button
      onClick={() => signIn('google', { callbackUrl: '/' })}
      className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-foreground shadow-sm backdrop-blur-md transition-all hover:bg-white/20 hover:scale-105 supports-[backdrop-filter]:bg-white/5 dark:border-white/10 dark:bg-black/10 dark:hover:bg-black/20"
    >
      <Icon icon="mdi:google" className="h-5 w-5" />
      <span>使用 Google 登录</span>
    </button>
  )
}
