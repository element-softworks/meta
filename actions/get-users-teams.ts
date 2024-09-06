import { db } from '@/lib/db';

export const getUsersTeams = async (userId: string) => {
	const usersTeams = await db.teamMember.findMany({
		where: {
			userId,
		},
		include: {
			team: {
				include: {
					members: {
						include: {
							user: true,
						},
					},
				},
			},
			user: true,
		},
	});

	if (!usersTeams) {
		return { teams: [] };
	}

	return { teams: usersTeams };
};
