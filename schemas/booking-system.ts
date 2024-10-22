import * as z from 'zod';

export const ReviewCoachApplicationSchema = z.object({
	status: z.enum(['APPROVED', 'REJECTED']),
});

export const CreateCoachSchema = z.object({
	timeframeDays: z.array(
		z.object({
			day: z.number().int().min(0).max(6), // Must be a number between 0 and 6
			startHour: z.number().min(0).max(23), // Must be a number between 0 and 23
			endHour: z.number().min(0).max(23), // Must be a number between 0 and 23
		})
	),
});

export const UpdateCoachScheduleSchema = z.object({
	timeframeDays: z.array(
		z.object({
			day: z.number().int().min(0).max(6), // Must be a number between 0 and 6
			startHour: z.number().min(0).max(23), // Must be a number between 0 and 23
			endHour: z.number().min(0).max(23), // Must be a number between 0 and 23
		})
	),
});

export const CoachBookingSchema = z.object({
	startDate: z.date(),
	endDate: z.date(),
	bookingType: z.enum(['BOOKING', 'BLOCKED']),
});
