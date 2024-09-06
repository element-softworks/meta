'use server';

import { db } from '@/lib/db';
export const getTeamById = async (teamId: string) => {
	console.log('teamId', teamId);
	if (!teamId?.length) {
		return { error: 'Team ID not provided' };
	}

	const team = await db.team.findUnique({
		where: {
			id: teamId,
		},
	});

	if (!team) {
		return { error: 'Team not found' };
	}

	return { team: team };
};
