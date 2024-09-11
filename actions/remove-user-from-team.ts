'use server';

import { findTeamById, getIsUserTeamAdmin, getTeamMemberByIds } from '@/data/team';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export const removeUserFromTeam = async (teamId: string, userId: string) => {
	const adminUser = await currentUser();

	const isTeamAdmin = await getIsUserTeamAdmin(teamId, adminUser?.id ?? '');

	if (!isTeamAdmin) {
		return { error: 'You are not authorized to remove a user from this team' };
	}

	// Find the team
	const team = await findTeamById(teamId);

	if (!team) {
		return { error: 'Team not found' };
	}

	// Find the team member
	const teamMember = await getTeamMemberByIds({ teamId, userId });

	if (!teamMember) {
		return { error: 'User not found in team' };
	}

	if (teamMember.role === 'OWNER') {
		return { error: 'Cannot remove the owner of the team' };
	}

	// Remove the team member
	await db.teamMember.delete({
		where: {
			teamId: teamId,
			userId: userId,
			teamId_userId: {
				teamId: teamId,
				userId: userId,
			},
		},
	});

	revalidatePath(`/teams/${teamId}`);

	return { success: 'User removed from team' };
};
