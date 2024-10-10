'use server';

import { db } from '@/db/drizzle/db';
import { customerInvoice, team, teamMember, user } from '@/db/drizzle/schema';
import { and, asc, count, desc, eq, or, sql } from 'drizzle-orm';

interface GetTeamsProps {
	pageNum: number;
	perPage: number;
	search: string;
	filters: {
		createdAt: string;
	};
}
export const getTeams = async (props: GetTeamsProps) => {
	const teamsResponse = await db
		.select({
			team: {
				...team,
				createdBy: sql`json_build_object(
					'id', ${user.id},
					'email', ${user.email},
					'name', ${user.name},
					'image', ${user.image}
				)`.as('createdBy'), // Aggregate user info as an object
			},
		})
		.from(team)
		.where(or(sql`lower(${team.name}) like ${`%${props.search.toLowerCase()}%`}`))
		.orderBy(props.filters.createdAt === 'asc' ? asc(team.createdAt) : desc(team.createdAt))
		.limit(props.perPage)
		.offset(props.perPage * (props.pageNum - 1))
		.leftJoin(user, eq(team.createdBy, user.email))
		.groupBy(team.id, user.id); // Group by team ID only

	const [totalTeams] = await db
		.select({ count: count() })
		.from(team)
		.where(or(sql`lower(${team.name}) like ${`%${props.search.toLowerCase()}%`}`));

	const totalPages = Math.ceil(totalTeams.count / props.perPage);

	return { teams: teamsResponse, totalPages: totalPages };
};
