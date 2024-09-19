import { db } from '@/db/drizzle/db';
import { conciergeToken } from '@/db/drizzle/schema';
import { eq } from 'drizzle-orm';

export const getConciergeTokenByToken = async (token: string) => {
	try {
		const conciergeTokenResponse = await db.query.conciergeToken.findFirst({
			where: eq(conciergeToken.token, token),
		});
		return conciergeTokenResponse;
	} catch (error) {
		console.error(error);
		return null;
	}
};

export const getConciergeTokenByEmail = async (email: string) => {
	try {
		const conciergeTokenResponse = await db.query.conciergeToken.findFirst({
			where: eq(conciergeToken.email, email),
		});
		return conciergeTokenResponse;
	} catch (error) {
		console.error(error);
		return null;
	}
};
