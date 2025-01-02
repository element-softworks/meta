import { db } from '@/db/drizzle/db';
import { channel, fixtureType, fixtureTypeCategory } from '@/db/drizzle/schema';
import { FixtureTypeCategory } from '@/db/drizzle/schema/fixtureTypeCategory';
import { checkPermissions } from '@/lib/auth';
import { and, count, desc, eq, isNull, not, sql } from 'drizzle-orm';
import { FixtureType } from '../../db/drizzle/schema/fixtureType';
import { Channel } from '@/db/drizzle/schema/channel';

export const getChannels = async (
	perPage: number,
	pageNum: number,
	search?: string,
	showArchived?: boolean
) => {
	const authResponse = await checkPermissions({ admin: false });

	if (authResponse?.error) {
		return authResponse;
	}

	try {
		// Main query to fetch policies with aggregated stores and questions
		const foundChannels = await db
			.select()
			.from(channel)
			.where(
				and(
					!showArchived
						? isNull(channel.archivedAt)
						: authResponse?.user?.role === 'ADMIN'
						? not(isNull(channel.archivedAt))
						: isNull(channel.archivedAt),
					!!search?.length
						? sql`lower(${channel.name}) like ${`%${search.toLowerCase()}%`}`
						: undefined
				)
			)
			.orderBy(desc(channel.createdAt))
			.limit(Number(perPage))
			.offset((Number(pageNum) - 1) * Number(perPage));

		// Count query
		const [totalChannels] = await db
			.select({ count: count() })
			.from(channel)
			.where(
				and(
					!showArchived
						? isNull(channel.archivedAt)
						: authResponse?.user?.role === 'ADMIN'
						? not(isNull(channel.archivedAt))
						: isNull(channel.archivedAt),
					!!search?.length
						? sql`lower(${channel.name}) like ${`%${search.toLowerCase()}%`}`
						: undefined
				)
			);

		const totalPages = Math.ceil(totalChannels.count / Number(perPage));

		return {
			success: true,
			channels: foundChannels,
			totalPages,
			total: totalChannels.count,
		};
	} catch (error) {
		console.error(error);
		return {
			error: 'An error occurred retrieving the channels, please try again later.',
		};
	}
};

export interface ChannelsResponse {
	success: boolean;
	channels: Channel[];
	totalPages: number;
	total: number;
}
