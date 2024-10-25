'use server';
import { isTeamOwnerServer } from '@/data/team';
import { db } from '@/db/drizzle/db';
import { team } from '@/db/drizzle/schema';
import { Team } from '@/db/drizzle/schema/team';
import { currentUser } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { cancelSubscription } from '../payment/cancelSubscription';
import { uncancelSubscription } from '../payment/uncancelSubscription';

export const adminArchiveTeam = async (archivingTeam: Team) => {
	const editingUser = await currentUser();

	if (!editingUser) {
		return { error: 'User not found' };
	}

	//If you are a team admin, or a site admin, you can archive/restore a team
	const isOwner = await isTeamOwnerServer(archivingTeam?.id, editingUser?.id ?? '');

	if (!isOwner && !(editingUser?.role === 'ADMIN')) {
		return { error: 'Unauthorized. Only the team owner can archive the team' };
	}

	// Archive the user
	const [archivedTeam] = await db
		.update(team)
		.set({
			isArchived: archivingTeam?.isArchived ? false : true,
		})
		.where(eq(team.id, archivingTeam?.id))
		.returning({
			isArchived: team.isArchived,
			stripeCustomerId: team.stripeCustomerId,
			id: team.id,
		});

	if (!!archivedTeam?.stripeCustomerId?.length) {
		if (archivedTeam?.isArchived) {
			await cancelSubscription(
				archivedTeam?.stripeCustomerId,
				archivedTeam?.id,
				editingUser?.id ?? ''
			);
		} else {
			await uncancelSubscription(
				archivedTeam?.stripeCustomerId,
				archivedTeam?.id,
				editingUser?.id ?? ''
			);
		}
	}

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
