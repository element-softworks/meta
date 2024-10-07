import { db } from '@/db/drizzle/db';
import { customer, team, user } from '@/db/drizzle/schema';
import { and, eq, exists, or } from 'drizzle-orm';
import { teamMember } from './../db/drizzle/schema';
import { currentUser } from '@/lib/auth';

export const getIsUserTeamAdmin = async (teamId: string, userId: string) => {
	const [teamResponse] = await db
		.select()
		.from(teamMember)
		.where(
			and(
				eq(teamMember.userId, userId),
				eq(teamMember.teamId, teamId),
				or(eq(teamMember.role, 'ADMIN'), eq(teamMember.role, 'OWNER'))
			)
		);

	if (!teamResponse) {
		return false;
	}

	return true;
};

export const getIsUserInTeam = async (teamId: string, userId: string) => {
	const teamResponse = await db.query.teamMember.findFirst({
		where: and(eq(teamMember.userId, userId), eq(teamMember.teamId, teamId)),
	});

	if (!teamResponse) {
		return false;
	}

	return true;
};

export const findTeamById = async (teamId: string) => {
	const teamResponse = await db.query.team.findFirst({
		where: eq(team.id, teamId),
	});

	return teamResponse;
};

export const getTeamCustomerByTeamId = async (teamId: string) => {
	const customerResponse = await db.query.customer.findFirst({
		where: and(eq(customer.teamId, teamId), eq(customer.status, 'active')),
	});

	return customerResponse;
};

export const getTeamById = async (teamId: string) => {
	if (!teamId?.length) {
		return { error: 'Team ID not provided' };
	}

	const currentUserData = await currentUser();

	const [teamResponse] = await db
		.select()
		.from(team)
		.where(eq(team.id, teamId))
		.leftJoin(
			teamMember,
			and(eq(teamMember.userId, currentUserData?.id ?? ''), eq(teamMember.teamId, team.id))
		)
		.leftJoin(customer, eq(customer.stripeCustomerId, team.stripeCustomerId));

	if (!teamResponse) {
		return { error: 'Team not found' };
	}

	// Structure the response in the required format
	const response = {
		team: teamResponse.Team,
		currentMember: teamResponse.TeamMember, // Data from `teamMember` table
		customer: teamResponse.Customer, // Data from `customer` table
	};

	return { success: 'Teams retrieved successfully.', data: response };
};

export const getTeamMemberByIds = async ({
	teamId,
	userId,
}: {
	teamId: string;
	userId: string;
}) => {
	const teamMemberResponse = await db.query.teamMember.findFirst({
		where: and(eq(teamMember.teamId, teamId), eq(teamMember.userId, userId)),
	});

	return teamMemberResponse;
};

export const isTeamAuthServer = async (teamId: string, userId: string) => {
	//If you are a team admin, or a site admin, you can archive/restore a team
	const isTeamAuth = await db
		.select()
		.from(teamMember)
		.where(
			and(
				eq(teamMember.userId, userId), // Check if the user matches
				eq(teamMember.teamId, teamId), // Check if the team matches
				or(
					eq(teamMember.role, 'ADMIN'), // Role is either ADMIN
					eq(teamMember.role, 'OWNER') // or OWNER
				)
			)
		)
		.limit(1); // Equivalent to findFirst

	return !!isTeamAuth;
};

export const isTeamOwnerServer = async (teamId: string, userId: string) => {
	//If you are a team admin, or a site admin, you can archive/restore a team
	const isTeamAuth = await db
		.select()
		.from(teamMember)
		.where(
			and(
				eq(teamMember.userId, userId), // Check if the user matches
				eq(teamMember.teamId, teamId), // Check if the team matches
				eq(teamMember.role, 'OWNER') // Role is OWNER
			)
		)
		.limit(1); // Equivalent to findFirst

	return !!isTeamAuth?.length;
};

export const getUsersTeams = async (userId: string) => {
	try {
		const teams = await db
			.select()
			.from(team)
			.where(
				and(
					eq(team.isArchived, false),
					exists(
						db
							.select()
							.from(teamMember)
							.where(
								and(eq(teamMember.teamId, team.id), eq(teamMember.userId, userId))
							)
					)
				)
			);

		return teams;
	} catch (error) {
		console.error(error);
		return null;
	}
};

export const addUserToTeam = async (
	teamId: string,
	userId: string,
	role: 'ADMIN' | 'OWNER' | 'USER'
) => {
	const teamResponse = await db.query.team.findFirst({ where: eq(team.id, teamId) });

	if (!teamResponse) {
		return { error: 'Team not found' };
	}

	//Create new team member for new user
	const [newTeamMember] = await db
		.insert(teamMember)
		.values({
			userId,
			teamId,
			role,
			updatedAt: new Date(),
		})
		.returning();

	if (!newTeamMember) {
		return { error: 'There was a problem registering, please try again later' };
	}
};
