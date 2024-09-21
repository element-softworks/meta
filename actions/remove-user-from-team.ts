'use server';

import { findTeamById, getIsUserTeamAdmin, getTeamMemberByIds } from '@/data/team';
import { db } from '@/db/drizzle/db';
import { teamMember } from '@/db/drizzle/schema';
import { currentUser } from '@/lib/auth';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const removeUserFromTeam = async (teamId: string, userId: string) => {
	const adminUser = await currentUser();

	const isTeamAdmin = await getIsUserTeamAdmin(teamId, adminUser?.id ?? '');

	console.log('isTeamAdmin', isTeamAdmin);
	if (!isTeamAdmin) {
		return { error: 'You are not authorized to remove a user from this team' };
	}

	// Find the team
	const team = await findTeamById(teamId);

	if (!team) {
		return { error: 'Team not found' };
	}

	// Find the team member
	const teamMemberResponse = await getTeamMemberByIds({ teamId, userId });

	if (!teamMemberResponse) {
		return { error: 'User not found in team' };
	}

	if (teamMemberResponse.role === 'OWNER') {
		return { error: 'Cannot remove the owner of the team' };
	}

	// Remove the team member
	await db
		.delete(teamMember)
		.where(and(eq(teamMember.teamId, teamId), eq(teamMember.userId, userId)));

	revalidatePath(`/teams/${teamId}`);

	return { success: 'User removed from team' };
};
