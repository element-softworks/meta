import { InferSelectModel, relations, sql } from 'drizzle-orm';
import { integer, pgTable, text, timestamp, index, foreignKey } from 'drizzle-orm/pg-core';
import { user } from '../user';
import { coachSchedule } from './coachSchedule';

export const coach = pgTable('Coach', {
	id: text('id')
		.primaryKey()
		.notNull()
		.default(sql`gen_random_uuid()`),
	userId: text('userId').notNull().unique(),
	scheduleId: text('scheduleId'),
	verified: timestamp('verified', { precision: 3, mode: 'date' }),
	createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: timestamp('updatedAt', { precision: 3, mode: 'date' })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	archivedAt: timestamp('archivedAt', { precision: 3, mode: 'date' }),
	cooldown: integer('cooldown').notNull().default(15),
});

export const coachRelations = relations(coach, ({ one, many }) => ({
	user: one(user, {
		fields: [coach.userId],
		references: [user.id],
	}),

	schedule: one(coachSchedule, {
		fields: [coach.scheduleId],
		references: [coachSchedule.id],
	}),
}));

export type Coach = InferSelectModel<typeof coach>;
