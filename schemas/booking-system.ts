import * as z from 'zod';

export const ReviewCoachApplicationSchema = z.object({
	status: z.enum(['APPROVED', 'REJECTED']),
});

const TimeframeSchema = z.object({
	startDate: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
	endDate: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
});

const TimeframeDaySchema = z.object({
	day: z.number().min(0).max(6), // Assuming days of the week (0 for Sunday to 6 for Saturday)
	timeframes: z.array(TimeframeSchema).optional(), // timeframes can be empty or not
});

export const CreateCoachSchema = z.object({
	timeframeDays: z.array(TimeframeDaySchema).length(7), // Must have exactly 7 days
});
