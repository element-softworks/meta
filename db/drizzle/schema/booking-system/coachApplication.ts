import { InferSelectModel, relations, sql } from 'drizzle-orm';
import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from '../user';
import { coach } from './coach';

export const applicationStatus = pgEnum('ApplicationStatus', ['PENDING', 'APPROVED', 'REJECTED']);

export const coachApplication = pgTable('coachApplication', {
	id: text('id')
		.primaryKey()
		.notNull()
		.default(sql`gen_random_uuid()`),
	coachId: text('coachId').notNull(),
	status: applicationStatus('status').default('PENDING').notNull(),
	reviewedAt: timestamp('reviewedAt', { precision: 3, mode: 'date' }),
	reviewedBy: text('reviewedBy'),
	createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
});

export const coachApplicationRelations = relations(coachApplication, ({ one, many }) => ({
	coach: one(coach, {
		fields: [coachApplication.coachId],
		references: [coach.id],
	}),
	reviewedBy: one(user, {
		fields: [coachApplication.reviewedBy],
		references: [user.id],
	}),
}));

export type CoachApplication = InferSelectModel<typeof coachApplication>;
