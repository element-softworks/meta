import { db } from '@/lib/db';
import { UserRole } from '@prisma/client';

export const getIsUserTeamAdmin = async (teamId: string, userId: string) => {
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
		},
	});

	if (!team) {
		return false;
	}

	const currentTeamUser = team.members.find((member) => member.user.id === userId);

	if (currentTeamUser?.role !== UserRole.ADMIN) {
		return false;
	}

	return true;
};

export const getIsUserInTeam = async (teamId: string, userId: string) => {
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

export const addUserToTeam = async (teamId: string, userId: string, role: UserRole) => {
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
