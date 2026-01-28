import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';
 
const intlMiddleware = createMiddleware(routing);
const { auth } = NextAuth(authConfig);
 
export default auth(async function middleware(req) {
  const isPrivatePath = req.nextUrl.pathname.startsWith('/admin');
  const isLoginPath = req.nextUrl.pathname.startsWith('/login');
  
  // For admin paths, check authentication
  if (isPrivatePath) {
    // req.auth is automatically populated by NextAuth
    const isAuthenticated = !!req.auth?.user;
    
    // If not logged in, redirect to login page
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // Skip i18n for /login and /admin paths
  if (isLoginPath || isPrivatePath) {
    return NextResponse.next();
  }
  
  // For all other paths, use i18n middleware
  return intlMiddleware(req);
});
 
export const config = {
  // Skip all paths that should not be internationalized.
  // This skips the folders "api", "_next" and all files with an extension (e.g. favicon.ico)
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
