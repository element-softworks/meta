'use server';

import { db } from '@/db/drizzle/db';
import { team, teamMember, user } from '@/db/drizzle/schema';
import { User } from '@/db/drizzle/schema/user';
import { and, asc, desc, eq, or, sql } from 'drizzle-orm';

interface GetTeamWithMembersProps {
	teamId: string;
	pageNum: number;
	perPage: number;
	search: string;
	showArchived: 'true' | 'false';
	filters: {
		createdAt: 'asc' | 'desc' | 'neutral';
	};
}

export const getTeamWithMembers = async (req: GetTeamWithMembersProps) => {
	if (!req.teamId?.length) {
		return { error: 'Team ID not provided' };
	}

	const teamMembersResponse = await db
		.select({ member: { ...teamMember, user: user } })
		.from(teamMember)
		.where(
			and(
				eq(teamMember.teamId, req.teamId),
				eq(user.isArchived, req.showArchived === 'true'),
				or(
					sql`lower(${user.name}) like ${`%${req.search.toLowerCase()}%`}`,
					sql`lower(${user.email}) like ${`%${req.search.toLowerCase()}%`}`
				)
			)
		)
		.leftJoin(user, eq(user.id, teamMember.userId))
		.orderBy(
			req.filters.createdAt === 'asc' ? asc(teamMember.createdAt) : desc(teamMember.createdAt)
		)
		.limit(req.perPage)
		.offset((req.pageNum - 1) * req.perPage);

	if (!team) {
	}

	return {
		success: 'Teams retrieved successfully.',
		team: teamMembersResponse as TeamMemberResponse,
		totalPages: 1,
	};
};

export type TeamMemberResponse = {
	member: {
		createdAt: Date;
		updatedAt: Date;
		teamId: string;
		userId: string;
		role: string;
		user: User;
	};
}[];
