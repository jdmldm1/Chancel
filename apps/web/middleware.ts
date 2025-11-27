export { auth as middleware } from '@/lib/auth'

export const config = {
  matcher: ['/sessions/:path*', '/api/:path*'],
}
