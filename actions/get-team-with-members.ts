'use server';

import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

export type TeamWithMembers = Prisma.TeamGetPayload<{
	include: {
		members: {
			include: {
				user: true;
			};
		};
	};
}>;

interface GetTeamWithMembersProps {
	teamId: string;
	pageNum: number;
	perPage: number;
	search: string;
	showArchived: 'true' | 'false';
	filters: {
		name: 'neutral' | 'desc' | 'asc';
		email: 'asc' | 'desc' | 'neutral';
		role: 'asc' | 'desc' | 'neutral';
		createdAt: 'asc' | 'desc' | 'neutral';
	};
}

export const getTeamWithMembers = async (req: GetTeamWithMembersProps) => {
	if (!req.teamId?.length) {
		return { error: 'Team ID not provided' };
	}

	const filters = Object.entries(req.filters)
		?.filter?.(([_, value]) => value !== 'neutral' && !!value)
		?.map(([key, value]) => {
			return { user: { [key]: value } };
		});

	const team = await db.team.findUnique({
		where: {
			id: req.teamId,
		},
		include: {
			members: {
				include: {
					user: true,
				},
				where: {
					user: {
						isArchived: req.showArchived === 'true',
					},
					AND: {
						OR: [
							{ user: { name: { contains: req.search, mode: 'insensitive' } } },
							{ user: { email: { contains: req.search, mode: 'insensitive' } } },
						],
					},
				},
				orderBy: filters,
			},
		},
	});

	const totalTeamMembers = await db.teamMember.count({
		where: {
			teamId: req.teamId,
			AND: {
				OR: [
					{ user: { name: { contains: req.search, mode: 'insensitive' } } },
					{ user: { email: { contains: req.search, mode: 'insensitive' } } },
				],
			},
		},
	});

	const totalPages = Math.ceil(totalTeamMembers / req.perPage);

	if (!team) {
		return { error: 'Team not found' };
	}

	return { success: 'Teams retrieved successfully.', team: team, totalPages: totalPages };
};
