import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import AppleProvider from 'next-auth/providers/apple'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const prisma = new PrismaClient()

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID || '',
      clientSecret: process.env.APPLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          console.log('Authorize called with credentials:', { email: credentials?.email })

          const parsed = signInSchema.safeParse(credentials)

          if (!parsed.success) {
            console.log('Validation failed:', parsed.error)
            return null
          }

          const { email, password } = parsed.data

          console.log('Looking up user:', email)
          const user = await prisma.user.findUnique({
            where: { email },
          })

          if (!user) {
            console.log('User not found:', email)
            return null
          }

          console.log('User found, checking password')
          const passwordMatch = await bcrypt.compare(password, user.password)

          if (!passwordMatch) {
            console.log('Password mismatch')
            return null
          }

          console.log('Authentication successful for:', email)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error('Error in authorize:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // After sign in, redirect to sessions page
      if (url === baseUrl || url === `${baseUrl}/` || url === `${baseUrl}/auth/login`) {
        return `${baseUrl}/sessions`
      }
      // Allow callback URLs on the same origin
      if (url.startsWith(baseUrl)) {
        return url
      }
      return baseUrl
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
})
