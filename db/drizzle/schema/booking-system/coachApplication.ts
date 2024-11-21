import { InferSelectModel, relations, sql } from 'drizzle-orm';
import { boolean, integer, jsonb, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from '../user';
import { coach } from './coach';

export const applicationStatus = pgEnum('ApplicationStatus', [
	'PENDING',
	'APPROVED',
	'REJECTED',
	'IN_PROGRESS',
]);

export const coachApplication = pgTable('coachApplication', {
	id: text('id')
		.primaryKey()
		.notNull()
		.default(sql`gen_random_uuid()`),
	coachId: text('coachId'),
	status: applicationStatus('status').default('PENDING').notNull(),
	reviewedAt: timestamp('reviewedAt', { precision: 3, mode: 'date' }),
	reviewedBy: text('reviewedBy'),
	createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),

	email: text('email'),
	agreedToMarketing: boolean('agreedToMarketing').default(false),
	agreedToTerms: boolean('agreedToTerms').default(false),
	firstName: text('firstName'),
	lastName: text('lastName'),
	password: text('password'),
	bookingInAdvance: integer('bookingInAdvance').default(28), // 4 weeks in advance bookings
	hoursExperience: integer('hoursExperience'),
	location: text('location'),
	timezone: text('timezone'),
	yearsExperience: integer('yearsExperience'),
	businessName: text('businessName'),
	businessNumber: text('businessNumber'),
	avatar: text('avatar'),
	certificates: jsonb('certificates'), // JSONB column for storing complex data
	idVerified: boolean('idVerified').default(false),
});

export const coachApplicationRelations = relations(coachApplication, ({ one, many }) => ({
	// coach: one(coach, {
	// 	fields: [coachApplication.coachId],
	// 	references: [coach.id],
	// }),
	reviewedBy: one(user, {
		fields: [coachApplication.reviewedBy],
		references: [user.id],
	}),
}));

export type CoachApplication = InferSelectModel<typeof coachApplication>;
