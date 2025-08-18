export { default } from 'next-auth/middleware'

export const config = {
  matcher: ['/dashboard/:path*', '/rewards/:path*', '/admin/:path*', '/activities/:path*'],
}

