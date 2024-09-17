'use server';

import { db } from '@/lib/db';

interface GetTeamInvoicesProps {
	teamId: string;
	pageNum: number;
	perPage: number;
	search: string;
	filters: {
		createdAt: string;
	};
}
export const getTeamInvoices = async (props: GetTeamInvoicesProps) => {
	const invoices = await db.customerInvoice.findMany({
		where: {
			teamId: props.teamId,
			AND: {
				OR: [
					{ id: { contains: props.search, mode: 'insensitive' } },
					{ status: { contains: props.search, mode: 'insensitive' } },
				],
			},
		},
		orderBy: {
			createdAt: props.filters.createdAt === 'asc' ? 'asc' : 'desc',
		},
	});

	return invoices;
};
