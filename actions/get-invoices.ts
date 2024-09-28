'use server';

import { db } from '@/db/drizzle/db';
import { customerInvoice, user } from '@/db/drizzle/schema';
import { desc, eq } from 'drizzle-orm';

export const getInvoices = async () => {
	const invoicesResponse = await db
		.select({
			invoice: customerInvoice,
			user: user,
		})
		.from(customerInvoice)
		.orderBy(desc(customerInvoice.createdAt))
		.limit(14)
		.leftJoin(user, eq(customerInvoice.email, user.email));

	return invoicesResponse;
};
