'use server';
import { isTeamOwnerServer } from '@/data/team';
import { db } from '@/db/drizzle/db';
import { team } from '@/db/drizzle/schema';
import { Team } from '@/db/drizzle/schema/team';
import { currentUser } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const adminArchiveTeam = async (archivingTeam: Team) => {
	const editingUser = await currentUser();

	//If you are a team admin, or a site admin, you can archive/restore a team
	const isOwner = await isTeamOwnerServer(archivingTeam?.id, editingUser?.id ?? '');

	if (!isOwner) {
		return { error: 'Unauthorized. Only the team owner can archive the team' };
	}

	// Archive the user
	const archivedTeam = await db
		.update(team)
		.set({
			isArchived: archivingTeam?.isArchived ? false : true,
		})
		.where(eq(team.id, archivingTeam?.id));

	if (!archivedTeam) {
		return { error: `Failed to ${archivingTeam?.isArchived ? 'restore' : 'archive'} team` };
	}

	revalidatePath(`/dashboard/teams/${archivingTeam?.id}`);

	return {
		success: `Team "${archivingTeam?.name}" ${
			archivingTeam?.isArchived ? 'restored' : 'archived'
		}`,
	};
};
