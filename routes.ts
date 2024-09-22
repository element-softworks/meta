/**
 * @description: Public routes
 * @param {string[]} publicRoutes - Array of public routes

 */

export const publicRoutes = [
	'/',
	'/docs',
	'/auth/new-verification',
	'/auth/new-password',
	'/api/webhooks/stripe',
];
export const adminRoute = '/dashboard/admin';

/**
 * @description: Auth routes
 * @param {string[]} authRoutes - Array of auth routes
 */

export const authRoutes = ['/auth/login', '/auth/register', '/auth/error', '/auth/reset'];

/**
 * @description: API routes
 * @param {string} apiPrefix - API prefix
 */
export const apiAuthPrefix = '/api/auth';

/**
 * @description: Default login redirect
 * @param {string} DEFAULT_LOGIN_REDIRECT - Default login redirect
 */
export const DEFAULT_LOGIN_REDIRECT = '/dashboard';
