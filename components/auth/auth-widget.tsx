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
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-coffee-600)] to-[var(--color-coffee-400)]">
              <span className="text-[8px] text-white font-semibold">{session.user.name?.[0] || 'U'}</span>
            </div>
          )}
          <span className="truncate text-[12px] text-[var(--sidebar-foreground)]">{session.user.name}</span>
        </div>
        <button
          onClick={() => signOut()}
          className="shrink-0 text-[color:color-mix(in_srgb,var(--sidebar-foreground)_75%,transparent)] transition-colors hover:text-[var(--sidebar-primary)]"
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
      className="flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[var(--color-coffee-600)] to-[var(--color-coffee-400)] px-3 py-1.5 text-[12px] font-medium text-white transition-opacity hover:opacity-90"
    >
      <Icon icon="mdi:google" className="h-4 w-4" />
      <span>Google 登录</span>
    </button>
  )
}
