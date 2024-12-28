import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes
const isPublicRoute = createRouteMatcher([
  "/sign-in",
  "/sign-up",
]);

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) {
    return NextResponse.next(); // Allow public routes without authentication
  }
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)", // Protect all routes except static files and Next.js internals
    "/",                          // Protect the root route
    "/(api|trpc)(.*)",            // Protect API and TRPC routes
  ],
};
