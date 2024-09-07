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
