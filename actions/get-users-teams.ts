import { db } from '@/db/drizzle/db';
import { team, teamMember, user } from '@/db/drizzle/schema';
import { and, or, eq, ilike, asc, desc, count } from 'drizzle-orm';

interface GetUserTeamProps {
	userId: string;
	pageNum: number;
	perPage: number;
	search: string;
	showArchived: 'true' | 'false';
}

export const getUsersTeams = async (req: GetUserTeamProps) => {
	// Query for the user's teams (with pagination)
	const usersTeams = await db
		.select()
		.from(team)
		.leftJoin(teamMember, eq(team.id, teamMember.teamId))
		.where(
			and(
				eq(team.isArchived, req.showArchived === 'true'),
				eq(teamMember.userId, req.userId),
				or(ilike(team.name, `%${req.search}%`), eq(team.id, req.search))
			)
		)
		.orderBy(asc(team.createdAt))
		.offset((req.pageNum - 1) * req.perPage)
		.limit(req.perPage);

	// Query for the total team count (without pagination)
	const totalTeamsResult = await db
		.select({ count: count() })
		.from(team)
		.leftJoin(teamMember, eq(team.id, teamMember.teamId))
		.where(
			and(
				eq(team.isArchived, req.showArchived === 'true'),
				eq(teamMember.userId, req.userId),
				or(ilike(team.name, `%${req.search}%`), eq(team.id, req.search))
			)
		);

	// Extract total count from the result
	const totalTeams = totalTeamsResult[0]?.count || 0;

	// Calculate total pages
	const totalPages = Math.ceil(totalTeams / req.perPage);

	return {
		success: 'Users retrieved successfully.',
		teams: usersTeams,
		totalPages: totalPages,
		totalTeams: totalTeams, // Total count of teams
	};
};
