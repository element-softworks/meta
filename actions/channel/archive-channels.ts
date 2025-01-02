'use server';

import { db } from '@/db/drizzle/db';
import { channel } from '@/db/drizzle/schema';
import { checkPermissions } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const archiveChannels = async (channelIds: string[]) => {
	const authData = await checkPermissions({ admin: true });

	let restore = false;
	if (authData?.error) {
		return authData;
	} else {
		await db.transaction(async (transaction: any) => {
			for (const channelId of channelIds) {
				const [currentChannel] = await transaction
					.select({ archivedAt: channel.archivedAt })
					.from(channel)
					.where(eq(channel.id, channelId));

				if (!!currentChannel?.archivedAt) {
					restore = true;
				}

				await transaction
					.update(channel)
					.set({
						archivedAt: !!currentChannel?.archivedAt ? null : new Date(),
						archivedBy: !!currentChannel?.archivedAt ? null : authData?.user?.id ?? '',
						updatedAt: new Date(),
						updatedBy: authData?.user?.id ?? '',
					})
					.where(eq(channel.id, channelId));
			}
		});

		revalidatePath('/dashboard/admin/channels');

		return {
			success: restore ? 'Channels restored successfully' : 'Channels archived successfully',
		};
	}
};
