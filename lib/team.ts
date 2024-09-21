import { TeamMember } from '@/db/drizzle/schema/teamMember';

export const isTeamAuth = (members: TeamMember[], userId: string) => {
	const currentTeamUser = members.find((member) => member.userId === userId);

	if (!currentTeamUser) {
		return false;
	}

	return currentTeamUser.role === 'ADMIN' || currentTeamUser.role === 'OWNER';
};

export const getCurrentTeamMember = (members: TeamMember[], userId: string) => {
	const currentTeamUser = members.find((member) => member.userId === userId);

	return currentTeamUser;
};

export const isTeamOwner = (members: TeamMember[], userId: string) => {
	const currentTeamUser = members.find((member) => member.userId === userId);

	if (!currentTeamUser) {
		return false;
	}

	return currentTeamUser.role === 'OWNER';
};
