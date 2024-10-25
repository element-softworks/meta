'use server';

import { db } from '@/db/drizzle/db';
import { conciergeToken, team } from '@/db/drizzle/schema';
import { currentUser } from '@/lib/auth';
import { and, count, eq, or, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getTeamInvitedUsers(
	teamId: string,
	perPage: number,
	pageNum: number,
	search: string = ''
) {
	if (!teamId) {
		return { error: 'Team ID is required' };
	}

	const authUser = await currentUser();
	if (!authUser) {
		return { error: 'User not found' };
	}
	const [foundTeam] = await db.select().from(team).where(eq(team.id, teamId));

	if (!foundTeam) {
		return { error: 'Team not found' };
	}

	const invitedUsers = await db
		.select()
		.from(conciergeToken)
		.where(
			and(
				eq(conciergeToken.teamId, foundTeam.id),
				or(
					sql`lower(${conciergeToken.name}) like ${`%${search.toLowerCase()}%`}`,
					sql`lower(${conciergeToken.email}) like ${`%${search.toLowerCase()}%`}`
				)
			)
		)
		.limit(perPage)
		.offset((pageNum - 1) * perPage);

	const [totalCount] = await db
		.select({ count: count() })
		.from(conciergeToken)
		.where(
			and(
				eq(conciergeToken.teamId, foundTeam.id),
				or(
					sql`lower(${conciergeToken.name}) like ${`%${search.toLowerCase()}%`}`,
					sql`lower(${conciergeToken.email}) like ${`%${search.toLowerCase()}%`}`
				)
			)
		);

	revalidatePath(`/dashboard/teams/${teamId}`);

	const totalPages = Math.ceil(totalCount.count / perPage);

	return { data: invitedUsers, totalPages };
}
