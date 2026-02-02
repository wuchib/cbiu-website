import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { authConfig } from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: {
    strategy: "jwt"
  },
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      if (token.role && session.user) {
        session.user.role = token.role as string
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    }
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      async authorize(credentials) {
        console.log("Authorize called with:", credentials?.email)
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data
          console.log("Searching for user:", email)
          const user = await prisma.user.findUnique({ where: { email } })
          if (!user) {
             console.log("User not found")
             return null
          }
          
          console.log("Comparing password for:", email)
          const passwordsMatch = await bcrypt.compare(password, user.passwordHash!)
          if (passwordsMatch) {
             console.log("Password matched, returning user")
             return user
          }
           console.log("Password mismatch")
        } else {
           console.log("Zod validation failed")
        }

        console.log("Invalid credentials")
        return null
      },
    }),
  ],
})
