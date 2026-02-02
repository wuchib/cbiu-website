'use client'

import { useSession } from 'next-auth/react'
import { SignInButton } from './sign-in-button'
import { UserNav } from './user-nav'

export function AuthWidget() {
  const { data: session } = useSession()

  return (
    <div className="fixed top-6 right-6 z-50">
      {session ? <UserNav /> : <SignInButton />}
    </div>
  )
}
