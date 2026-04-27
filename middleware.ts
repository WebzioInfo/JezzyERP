import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionCookie } from '@/lib/auth';

const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/'];
const API_ROUTES_PREFIX = '/api';

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    const isPublicRoute = PUBLIC_ROUTES.includes(path);
    const isApiRoute = path.startsWith(API_ROUTES_PREFIX);

    // Skip auth checks for completely public assets
    if (path.startsWith('/_next') || path.includes('.')) {
        return NextResponse.next();
    }

    // 1. Verify Session
    const session = await verifySessionCookie();

    // 2. Route Guarding Logic
    if (!session && !isPublicRoute) {
        // Redirect unauthenticated users to login
        if (isApiRoute) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    if (session && isPublicRoute && path !== '/') {
        // Authenticated users shouldn't see the login page
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
    }

    // 3. Security Headers (Anti-Clickjacking, Prevent Sniffing, CSP)
    const response = NextResponse.next();
    
    // Security Best Practices
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    
    // Content Security Policy
    const cspHeader = `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval';
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        img-src 'self' blob: data:;
        font-src 'self' https://fonts.gstatic.com;
        frame-src 'self' blob:;
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'self';
        block-all-mixed-content;
        upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim();
    
    response.headers.set('Content-Security-Policy', cspHeader);

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
