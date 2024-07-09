import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from './app/_auth/sessions'; 
import { cookies } from 'next/headers';

// 1. Specify protected and public routes
const protectedRoutes = ['/alya', "/tietokanta"];
const publicRoutes = ['/login', '/signup', '/'];

export default async function middleware(req: NextRequest) {
  // 1. Skip middleware in development
  const development = process.env.NODE_ENV === 'development';
  if (development) {
    return NextResponse.next();
  }

  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Decrypt the session from the cookie
  const cookie = cookies().get('session')?.value;
  const session = await decrypt(cookie);
  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session?.userId) {
    console.log("redirecting to login")
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }
  // 5. Redirect to /alya if the user is authenticated
  if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith('/alya')
  ) {
    return NextResponse.redirect(new URL('/alya', req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}