import { TeamMember, TeamRole } from '@prisma/client';
import { db } from './db';

export const isTeamAuth = (members: TeamMember[], userId: string) => {
	const currentTeamUser = members.find((member) => member.userId === userId);

	if (!currentTeamUser) {
		return false;
	}

	return currentTeamUser.role === TeamRole.ADMIN || currentTeamUser.role === TeamRole.OWNER;
};

export const isTeamOwner = (members: TeamMember[], userId: string) => {
	const currentTeamUser = members.find((member) => member.userId === userId);

	if (!currentTeamUser) {
		return false;
	}

	return currentTeamUser.role === TeamRole.OWNER;
};
