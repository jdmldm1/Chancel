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
  trustHost: true,
  useSecureCookies: false, // Disabled for homelab HTTP access
  providers: [
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
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // For OAuth providers, create/update user in database
        if (account && account.provider !== 'credentials') {
          console.log('OAuth sign in - provider:', account.provider, 'email:', user.email)

          if (!user.email) {
            console.error('OAuth user missing email')
            return false
          }

          // Check if user exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          })

          if (!existingUser) {
            // Create new user for OAuth sign-in
            console.log('Creating new OAuth user:', user.email)
            const newUser = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || null,
                password: null, // OAuth users don't have passwords
                emailVerified: new Date(), // OAuth emails are pre-verified
                profilePicture: user.image || null,
              },
            })
            console.log('Created user with id:', newUser.id)
            user.id = newUser.id
            user.role = newUser.role
          } else {
            console.log('Existing user found:', existingUser.id)
            user.id = existingUser.id
            user.role = existingUser.role

            // Update user info from OAuth provider if needed
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                name: user.name || existingUser.name,
                profilePicture: user.image || existingUser.profilePicture,
                emailVerified: existingUser.emailVerified || new Date(),
              },
            })
          }
        }
        return true
      } catch (error) {
        console.error('Error in signIn callback:', error)
        return false
      }
    },
    async redirect({ url, baseUrl }) {
      console.log('Redirect callback - url:', url, 'baseUrl:', baseUrl)
      // After sign in, redirect to dashboard
      if (url === baseUrl || url === `${baseUrl}/` || url === `${baseUrl}/auth/login`) {
        console.log('Redirecting to dashboard')
        return `${baseUrl}/dashboard`
      }
      // Allow callback URLs on the same origin
      if (url.startsWith(baseUrl)) {
        console.log('Redirecting to requested URL:', url)
        return url
      }
      console.log('Redirecting to baseUrl:', baseUrl)
      return baseUrl
    },
    async jwt({ token, user }) {
      try {
        if (user) {
          token.id = user.id
          token.role = user.role
          console.log('JWT callback: token created with id:', user.id, 'role:', user.role)
        }
        return token
      } catch (error) {
        console.error('JWT callback error:', error)
        throw error
      }
    },
    async session({ session, token }) {
      try {
        if (session.user) {
          session.user.id = token.id as string
          session.user.role = token.role as string
          console.log('Session callback: session updated with id:', token.id)
        }
        return session
      } catch (error) {
        console.error('Session callback error:', error)
        throw error
      }
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
        secure: false, // Disabled for homelab HTTP access
        maxAge: 30 * 24 * 60 * 60, // 30 days
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
})
