import { TeamMember, TeamRole } from '@prisma/client';
import { db } from './db';

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
		},
	});

	if (!team) {
		return { error: 'Team not found' };
	}

	return { success: 'Teams retrieved successfully.', team: team };
};

export const isTeamAuth = (members: TeamMember[], userId: string) => {
	const currentTeamUser = members.find((member) => member.userId === userId);

	if (!currentTeamUser) {
		return false;
	}

	return currentTeamUser.role === TeamRole.ADMIN || currentTeamUser.role === TeamRole.OWNER;
};
