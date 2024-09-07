import { db } from '@/lib/db';
import { act } from 'react';

interface GetUserTeamProps {
	userId: string;
	pageNum: number;
	perPage: number;
	search: string;
	showArchived: 'true' | 'false';
	filters: {
		name: 'neutral' | 'desc' | 'asc';
		createdBy: 'asc' | 'desc' | 'neutral';
		createdAt: 'asc' | 'desc' | 'neutral';
		updatedAt: 'asc' | 'desc' | 'neutral';
	};
}

export const getUsersTeams = async (req: GetUserTeamProps) => {
	// Filter out 'neutral' and undefined values from the filters

	const filters = Object.entries(req.filters)
		?.filter?.(([_, value]) => value !== 'neutral' && !!value)
		?.map(([key, value]) => {
			return { team: { [key]: value } };
		});

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
		orderBy: filters,

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
