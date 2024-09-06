import { db } from '@/lib/db';

interface GetUserTeamProps {
	userId: string;
	pageNum: number;
	perPage: number;
	search: string;
	showArchived: 'true' | 'false';
}

export const getUsersTeams = async (req: GetUserTeamProps) => {
	const usersTeams = await db.teamMember.findMany({
		where: {
			team: {
				isArchived: req.showArchived === 'true',
			},
			userId: req.userId,
			AND: {
				OR: [
					{ team: { name: { contains: req.search, mode: 'insensitive' } } },
					{ team: { id: { equals: req.search } } },
				],
			},
		},
		skip: (req.pageNum - 1) * req.perPage,
		take: req.perPage,

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

	console.log(usersTeams, 'teams data');

	// Get the total count of documents with specific filters but without pagination and search filters
	const totalTeams = await db.team.count({
		where: {
			isArchived: req.showArchived === 'true',
			members: {
				some: {
					userId: req.userId,
				},
			},
			AND: {
				OR: [
					{ name: { contains: req.search, mode: 'insensitive' } },
					{ id: { equals: req.search } },
				],
			},
		},
	});

	if (!usersTeams) {
		return { teams: [] };
	}

	const totalPages = Math.ceil(totalTeams / req.perPage);

	return { success: 'Users retrieved successfully.', teams: usersTeams, totalPages: totalPages };
};
