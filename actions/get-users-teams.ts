import { db } from '@/db/drizzle/db';
import { team, user } from '@/db/drizzle/schema';
import { Team, User } from '@prisma/client';
import { and, eq, inArray } from 'drizzle-orm';
import { teamMember } from './../db/drizzle/schema';

interface GetUserTeamProps {
	userId: string;
	pageNum: number;
	perPage: number;
	search: string;
	showArchived: 'true' | 'false';
}

export const getUsersTeams = async (req: GetUserTeamProps) => {
	// Query for the user's teams (with pagination)

	const userTeamIds = await db
		.select({ id: teamMember.teamId })
		.from(teamMember)
		.where(eq(teamMember.userId, req.userId));

	const teamsResponse = await db
		.select()
		.from(team)
		.where(
			and(
				inArray(
					team.id,
					userTeamIds.map((t) => t.id)
				),
				eq(team.isArchived, req.showArchived === 'true')
			)
		);

	const teamMembers = await db
		.select({ role: teamMember.role, details: user, teamId: teamMember.teamId })
		.from(teamMember)
		.where(
			inArray(
				teamMember.teamId,
				teamsResponse?.map((t) => t.id)
			)
		)
		.leftJoin(user, eq(user.id, teamMember.userId));

	const teamWithMembers = teamsResponse.map((team) => {
		const members = teamMembers.filter((member) => member.teamId === team.id);
		return { team: { ...team, members } };
	});

	console.log(teamWithMembers, 'teamWithMembers');
	return {
		success: 'Teams retrieved successfully.',
		data: teamWithMembers as GetUsersTeamsResponse,
		totalPages: 1,
	};
};

export type GetUsersTeamsResponse = {
	team: Team & { members: { role: string; details: User; teamId: string }[] };
}[];
