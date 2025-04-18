import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/og(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  const path = req.nextUrl.pathname;
  const { userId } = await auth();
  
  // Redirect authenticated users from root to /home
  if (path === '/' && userId) {
    return NextResponse.redirect(new URL('/home', req.url));
  }
  
  // If the route is not public and user is not authenticated, redirect to sign-in
  if (!isPublicRoute(req) && !userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};