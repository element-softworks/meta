'use server';

import { findTeamById, getTeamMemberByIds } from '@/data/team';
import { db } from '@/db/drizzle/db';
import { teamMember } from '@/db/drizzle/schema';
import { currentUser } from '@/lib/auth';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const userLeaveTeam = async (teamId: string) => {
	const user = await currentUser();

	// Find the team
	const team = await findTeamById(teamId);

	if (!team) {
		return { error: 'Team not found' };
	}

	// Find the team member
	const teamMemberResponse = await getTeamMemberByIds({ teamId, userId: user?.id ?? '' });

	if (!teamMemberResponse) {
		return { error: 'User not found in team' };
	}

	if (teamMemberResponse.role === 'OWNER') {
		return { error: 'Owner cannot leave team' };
	}

	// Remove the team member
	await db
		.delete(teamMember)
		.where(and(eq(teamMember.teamId, teamId), eq(teamMember.userId, user?.id!)));

	revalidatePath(`/teams/${teamMemberResponse.teamId!}`);

	return { success: `Successfully left team ${team?.name ?? ''}` };
};
