import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  
  // Admin subdomain - route to /admin
  if (hostname.includes('admin.')) {
    if (!request.nextUrl.pathname.startsWith('/admin')) {
      return NextResponse.rewrite(new URL('/admin' + request.nextUrl.pathname, request.url));
    }
  }
  
  // Allow /admin routes on main domain
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

