import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/accounts(.*)',
  '/alerts(.*)',
  '/monitoring(.*)',
  '/settings(.*)',
  '/transfers(.*)',
  '/simulator(.*)',
]);

const isAdminRoute = createRouteMatcher([
  '/admin(.*)',
  '/settings(.*)', // Assuming settings require admin
]);

const clerkMiddlewareOptions = {
  signInUrl: '/login',
  signUpUrl: '/register',
};

export default clerkMiddleware(
  async (auth, req) => {
    if (isProtectedRoute(req)) {
      await auth.protect();
    }

    // Admin-only routes
    if (isAdminRoute(req)) {
      await auth.protect({ role: 'admin' }, { unauthorizedUrl: '/dashboard' });
    }
  },
  clerkMiddlewareOptions
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};