import { InferSelectModel, relations, sql } from 'drizzle-orm';
import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from '../user';
import { coach } from './coach';

export const bookingType = pgEnum('BookingType', ['BOOKING', 'BLOCKED']);

export const coachBooking = pgTable('coachBooking', {
	id: text('id')
		.primaryKey()
		.notNull()
		.default(sql`gen_random_uuid()`),
	coachId: text('coachId').notNull(),
	createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	createdById: text('createdById'),
	bookingType: bookingType('bookingType').default('BOOKING').notNull(),
	startDate: timestamp('startDate', { precision: 3, mode: 'date' }).notNull(),
	endDate: timestamp('endDate', { precision: 3, mode: 'date' }).notNull(),
});

export const coachBookingRelations = relations(coachBooking, ({ one, many }) => ({
	coach: one(coach, {
		fields: [coachBooking.coachId],
		references: [coach.id],
	}),
	createdBy: one(user, {
		fields: [coachBooking.createdById],
		references: [user.id],
	}),
}));

export type CoachBooking = InferSelectModel<typeof coachBooking>;
