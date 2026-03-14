'use client'

import { useSession, signOut } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Icon } from '@iconify/react'

export function UserNav() {
  const { data: session } = useSession()

  if (!session?.user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative h-7 w-7 rounded-full ring-1 ring-[#D4C8BC] transition-all hover:ring-[#C4956A]">
          <Avatar className="h-7 w-7">
            <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
            <AvatarFallback className="bg-gradient-to-br from-[#D4A574] to-[#C4956A] text-white text-[10px] font-semibold">
              {session.user.name?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{session.user.name}</p>
            <p className="text-xs text-muted-foreground leading-none">{session.user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
          <Icon icon="mdi:logout" className="mr-2 h-4 w-4" />
          <span>退出登录</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
