import { db } from '@/lib/db';
import { TeamRole } from '@prisma/client';

export const getIsUserTeamAdmin = async (teamId: string, userId: string) => {
	const team = await db.team.findUnique({
		where: {
			id: teamId,
		},
		include: {
			members: {
				include: {
					user: {
						select: {
							id: true,
						},
					},
				},
			},
		},
	});

	if (!team) {
		return false;
	}

	const currentTeamUser = team.members.find((member) => member.user.id === userId);

	if (currentTeamUser?.role === TeamRole.ADMIN || currentTeamUser?.role === TeamRole.OWNER) {
		return true;
	}

	return false;
};

export const getIsUserInTeam = async (teamId: string, userId: string) => {
	const team = await db.team.findUnique({
		where: {
			id: teamId,
		},
		include: {
			members: {
				include: {
					user: {
						select: {
							id: true,
						},
					},
				},
			},
		},
	});

	if (!team) {
		return false;
	}

	const currentTeamUser = team.members.find((member) => member.user.id === userId);

	if (!currentTeamUser) {
		return false;
	}

	return true;
};

export const findTeamById = async (teamId: string) => {
	const team = await db.team.findUnique({
		where: {
			id: teamId,
		},
	});

	return team;
};

export const getTeamById = async (teamId: string) => {
	if (!teamId?.length) {
		return { error: 'Team ID not provided' };
	}

	const team = await db.team.findUnique({
		where: {
			id: teamId,
		},
		include: {
			members: {
				include: {
					user: true,
				},
			},
			subscriptions: true,
		},
	});

	if (!team) {
		return { error: 'Team not found' };
	}

	return { success: 'Teams retrieved successfully.', team: team };
};

export const getTeamMemberByIds = async ({
	teamId,
	userId,
}: {
	teamId: string;
	userId: string;
}) => {
	const teamMember = await db.teamMember.findFirst({
		where: {
			teamId,
			userId,
		},
	});

	return teamMember;
};

export const getUsersTeams = async (userId: string) => {
	try {
		const teams = await db.team.findMany({
			where: {
				isArchived: false,
				members: {
					some: {
						userId,
					},
				},
			},
		});

		return teams;
	} catch (error) {
		console.error(error);
		return null;
	}
};

export const addUserToTeam = async (teamId: string, userId: string, role: TeamRole) => {
	const team = await db.team.findUnique({
		where: {
			id: teamId,
		},
	});

	if (!team) {
		return { error: 'Team not found' };
	}

	//Create new team member for new user
	const newTeamMember = await db.teamMember.create({
		data: {
			userId: userId,
			teamId: teamId,
			role: role,
		},
	});

	if (!newTeamMember) {
		return { error: 'There was a problem registering, please try again later' };
	}
};
