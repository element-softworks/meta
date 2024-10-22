import { InferSelectModel, relations, sql } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { timeframeDay } from './timeframeDay';

export const coachSchedule = pgTable('coachSchedule', {
	id: text('id')
		.primaryKey()
		.notNull()
		.default(sql`gen_random_uuid()`),
	coachId: text('coachId').notNull(),
	createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: timestamp('updatedAt', { precision: 3, mode: 'date' }).default(
		sql`CURRENT_TIMESTAMP`
	),
});

export const coachScheduleRelations = relations(coachSchedule, ({ one, many }) => ({
	weeklyschedule: many(timeframeDay),
}));

export type Coachschedule = InferSelectModel<typeof coachSchedule>;
