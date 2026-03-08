'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { Icon } from '@iconify/react'

export function AuthWidget() {
  const { data: session } = useSession()

  if (session?.user) {
    return (
      <div className="flex items-center justify-between gap-2 rounded-md">
        <div className="flex items-center gap-2 min-w-0">
          {session.user.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || ''}
              className="h-5 w-5 rounded-full shrink-0"
            />
          ) : (
            <div className="h-5 w-5 rounded-full bg-gradient-to-br from-[#D4A574] to-[#C4956A] flex items-center justify-center shrink-0">
              <span className="text-[8px] text-white font-semibold">{session.user.name?.[0] || 'U'}</span>
            </div>
          )}
          <span className="text-[12px] text-[#5C5147] truncate">{session.user.name}</span>
        </div>
        <button
          onClick={() => signOut()}
          className="shrink-0 text-[#8B7E74] hover:text-[#C4956A] transition-colors"
          title="退出登录"
        >
          <Icon icon="lucide:log-out" className="h-3.5 w-3.5" />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => signIn('google', { callbackUrl: '/' })}
      className="flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#D4A574] to-[#C4956A] px-3 py-1.5 text-[12px] font-medium text-white hover:opacity-90 transition-opacity"
    >
      <Icon icon="mdi:google" className="h-4 w-4" />
      <span>Google 登录</span>
    </button>
  )
}
