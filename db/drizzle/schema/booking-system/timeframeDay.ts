import { InferSelectModel, relations, sql } from 'drizzle-orm';
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { coachSchedule } from './coachSchedule';
import { timeframe } from './timeframe';

export const timeframeDay = pgTable('timeframeDay', {
	id: text('id')
		.primaryKey()
		.notNull()
		.default(sql`gen_random_uuid()`),
	day: integer('day').notNull(),
	coachScheduleId: text('coachScheduleId').notNull(),
	createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
});

export const timeframeDayRelations = relations(timeframeDay, ({ one, many }) => ({
	timeframes: many(timeframe),
	coachSchedule: one(coachSchedule, {
		fields: [timeframeDay.coachScheduleId],
		references: [coachSchedule.id],
	}),
}));

export type Coachschedule = InferSelectModel<typeof timeframeDay>;
