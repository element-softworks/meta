import { db } from '@/lib/db';

export const getConciergeTokenByToken = async (token: string) => {
	try {
		const conciergeToken = await db.conciergeToken.findUnique({ where: { token } });
		return conciergeToken;
	} catch (error) {
		console.error(error);
		return null;
	}
};

export const getConciergeTokenByEmail = async (email: string) => {
	try {
		const conciergeToken = await db.conciergeToken.findFirst({ where: { email } });
		return conciergeToken;
	} catch (error) {
		console.error(error);
		return null;
	}
};
