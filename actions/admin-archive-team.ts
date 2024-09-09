'use server';
import { TableTeam } from '@/components/tables/teams-table';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { isTeamAuth } from '@/lib/team';
import { Team, TeamMember, TeamRole, UserRole } from '@prisma/client';
import { User } from 'next-auth';
import { revalidatePath } from 'next/cache';

export const adminArchiveTeam = async (
	archivingTeam: (Team & { members: (TeamMember & { user: User })[] }) | null | TableTeam
) => {
	const editingUser = await currentUser();

	//If you are a team admin, or a site admin, you can archive/restore a team
	const isTeamAdmin = isTeamAuth(archivingTeam?.members ?? [], editingUser?.id ?? '');

	if (!isTeamAdmin) {
		return { error: 'Unauthorized' };
	}

	// Archive the user
	const archivedTeam = await db.team.update({
		where: { id: archivingTeam?.id },
		data: {
			isArchived: archivingTeam?.isArchived ? false : true,
		},
	});

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
