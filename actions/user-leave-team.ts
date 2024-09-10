'use server';

import { findTeamById, getTeamMemberByIds } from '@/data/team';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export const userLeaveTeam = async (teamId: string) => {
	const user = await currentUser();

	// Find the team
	const team = await findTeamById(teamId);

	if (!team) {
		return { error: 'Team not found' };
	}

	// Find the team member
	const teamMember = await getTeamMemberByIds({ teamId, userId: user?.id ?? '' });

	if (!teamMember) {
		return { error: 'User not found in team' };
	}

	if (teamMember.role === 'OWNER') {
		return { error: 'Owner cannot leave team' };
	}

	// Remove the team member
	const leavingTeam = await db.teamMember.delete({
		where: {
			teamId: teamId,
			userId: user?.id,
			teamId_userId: {
				teamId: teamId,
				userId: user?.id ?? '',
			},
		},
	});

	revalidatePath(`/teams/${teamId}`);

	return { success: `Successfully left team ${team?.name ?? ''}` };
};
