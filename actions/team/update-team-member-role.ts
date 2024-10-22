'use server';

import { getTeamById } from '@/data/team';
import { db } from '@/db/drizzle/db';
import { teamMember } from '@/db/drizzle/schema';
import { currentUser } from '@/lib/auth';
import { ChangeTeamRoleSchema } from '@/schemas';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';

/**
 *
 * @param values
 * @param teamMemberId
 * @returns
 *
 */
export const updateTeamMemberRole = async (
	values: z.infer<typeof ChangeTeamRoleSchema>,
	userId: string,
	teamId: string
) => {
	const user = await currentUser();

	if (!user) {
		return { error: 'You must be logged in to update a team member role' };
	}

	const [teamOwner] = await db
		.select()
		.from(teamMember)
		.where(and(eq(teamMember.teamId, teamId), eq(teamMember.role, 'OWNER')));

	const validatedFields = ChangeTeamRoleSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: 'There was a problem validating your role. Please try again.' };
	}

	const teamResponse = await getTeamById(teamId);

	if (!teamResponse.data?.team) {
		return { error: 'Team not found' };
	}

	if (userId === teamOwner?.userId) {
		return { error: 'You cannot update the team owners role' };
	}

	if (teamResponse.data?.currentMember?.role === 'USER' && user?.role !== 'ADMIN') {
		return { error: 'You must be an admin to update a team members role' };
	}

	const [foundTeamMember] = await db
		.select()
		.from(teamMember)
		.where(and(eq(teamMember.userId, userId), eq(teamMember.teamId, teamId)));

	if (!foundTeamMember) {
		return { error: 'Team member not found' };
	}

	try {
		if (values.role === 'OWNER') {
			if (teamResponse.data?.currentMember?.role !== 'OWNER' && user?.role !== 'ADMIN') {
				return { error: 'You must be team owner to transfer ownership.' };
			}
			await db
				.update(teamMember)
				.set({ role: 'ADMIN' })
				.where(and(eq(teamMember.teamId, teamId), eq(teamMember.role, 'OWNER')));
		}
		await db
			.update(teamMember)
			.set({ role: values.role })
			.where(and(eq(teamMember.userId, userId), eq(teamMember.teamId, teamId)));
	} catch (error) {
		return { error: 'There was a problem updating the team member role' };
	}

	revalidatePath(`/teams/${teamId}`);

	return { success: 'Team member role updated' };

	// Update the team member role in the database
};
