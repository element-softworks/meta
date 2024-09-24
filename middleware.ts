import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import authConfig from './auth.config';
import {
	DEFAULT_LOGIN_REDIRECT,
	adminRoute,
	apiAuthPrefix,
	authRoutes,
	fuzzyPublicRoutes,
	publicRoutes,
} from './routes';
import { getSession } from 'next-auth/react';
const { auth } = NextAuth(authConfig);

export default auth(async (req, res) => {
	const { nextUrl } = req;

	const isLoggedIn = !!req.auth;

	const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
	const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
	const isFuzzyPublicRoute = fuzzyPublicRoutes.some((route) =>
		nextUrl.pathname.startsWith(route)
	);
	const isAuthRoute = authRoutes.includes(nextUrl.pathname);

	if (isApiAuthRoute) {
		return NextResponse.next();
	}
	if (isAuthRoute) {
		if (isLoggedIn) {
			return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
		}

		return;
	}

	if (!isLoggedIn && !isPublicRoute && !isFuzzyPublicRoute) {
		let callbackUrl = nextUrl.pathname;
		if (nextUrl.search) {
			callbackUrl += nextUrl.search;
		}

		const encodedCallbackUrl = encodeURIComponent(callbackUrl);

		return Response.redirect(new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl));
	}

	return;
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

// export default function middleware() {
// 	return;
// }
