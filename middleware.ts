import authConfig from './auth.config';
import NextAuth from 'next-auth';
import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes } from './routes';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
	const { nextUrl } = req;
	const isLoggedIn = !!req.auth;

	const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
	const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
	const isAuthRoute = authRoutes.includes(nextUrl.pathname);

	console.log('isApiAuthRoute', isApiAuthRoute);
	console.log('isPublicRoute', isPublicRoute);
	console.log('isAuthRoute', isAuthRoute);
	console.log('isLoggedIn', isLoggedIn);

	if (isApiAuthRoute) {
		return NextResponse.next();
	}

	if (isAuthRoute) {
		if (isLoggedIn) {
			console.log('redirecting to default login redirect');
			return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
		}

		return NextResponse.next();
	}

	if (!isLoggedIn && !isPublicRoute) {
		return Response.redirect(new URL('/auth/login', nextUrl));
	}

	return NextResponse.next();
});

// Optionally, don't invoke Middleware on some paths
export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		// Always run for API routes
		'/(api|trpc)(.*)',
	],
};
