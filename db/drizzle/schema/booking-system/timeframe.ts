import { InferSelectModel, relations, sql } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { timeframeDay } from './timeframeDay';

export const timeframe = pgTable('timeframe', {
	id: text('id')
		.primaryKey()
		.notNull()
		.default(sql`gen_random_uuid()`),
	timeframeDayId: text('timeframeDayId').notNull(),
	startDate: text('startDate').notNull(),
	endDate: text('endDate').notNull(),
	createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
});

export const timeframeRelations = relations(timeframe, ({ one, many }) => ({
	timeframeDay: one(timeframeDay, {
		fields: [timeframe.timeframeDayId],
		references: [timeframeDay.id],
	}),
}));

export type Coachschedule = InferSelectModel<typeof timeframe>;
