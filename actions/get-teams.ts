'use server';

import { db } from '@/db/drizzle/db';
import { team, teamMember, user } from '@/db/drizzle/schema';
import { asc, count, desc, eq, or, sql } from 'drizzle-orm';

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
					'id', creatorUser.id,
					'email', creatorUser.email,
					'name', creatorUser.name,
					'image', creatorUser.image
				)`.as('createdBy'), // Aggregate team creator (user) info as an object
				users: sql`json_agg(
					json_build_object(
						'id', teamMemberUser.id,
						'email', teamMemberUser.email,
						'name', teamMemberUser.name,
						'image', teamMemberUser.image
					)
				)`.as('users'), // Aggregate users linked to the team as an array
			},
		})
		.from(team)
		.where(or(sql`lower(${team.name}) like ${`%${props.search.toLowerCase()}%`}`))
		.orderBy(props.filters.createdAt === 'asc' ? asc(team.createdAt) : desc(team.createdAt))
		.limit(props.perPage)
		.offset(props.perPage * (props.pageNum - 1))
		// Join for the user who created the team (aliased using raw SQL as "creatorUser")
		.leftJoin(sql`${user} as creatorUser`, eq(team.createdBy, sql`creatorUser.email`))
		// Join teamMember on teamId and then the user associated with each teamMember (aliased using raw SQL as "teamMemberUser")
		.leftJoin(teamMember, eq(team.id, teamMember.teamId))
		.leftJoin(sql`${user} as teamMemberUser`, eq(teamMember.userId, sql`teamMemberUser.id`))
		.groupBy(team.id, sql`creatorUser.id`); // Group by team ID and creatorUser ID

	const [totalTeams] = await db
		.select({ count: count() })
		.from(team)
		.where(or(sql`lower(${team.name}) like ${`%${props.search.toLowerCase()}%`}`));

	const totalPages = Math.ceil(totalTeams.count / props.perPage);

	return { teams: teamsResponse, totalPages: totalPages };
};
