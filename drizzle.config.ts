import { defineConfig } from 'drizzle-kit';
export default defineConfig({
	dialect: 'postgresql',
	out: './db/drizzle',
	schema: './db/drizzle/schema.ts',
	dbCredentials: {
		url: process.env.AUTH_DRIZZLE_URL!,
	},
	// Print all statements
	verbose: true,
	// Always ask for confirmation
	strict: true,
});
