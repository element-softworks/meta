'use server';
import { db } from '@/db/drizzle/db';
import { coach, coachApplication } from '@/db/drizzle/schema';
import { currentUser } from '@/lib/auth';
import { sendCoachApplicationStatusEmail } from '@/lib/mail';
import { ReviewCoachApplicationSchema } from '@/schemas/booking-system';
import { eq } from 'drizzle-orm';
import * as z from 'zod';

/**
 * Reviews a coach application.
 *
 * @param {z.infer<typeof ReviewCoachApplicationSchema>} values - The values containing the coach application review details.
 *   This should conform to the `ReviewCoachApplicationSchema` and must include a `status` field.
 *
 * @param {string} applicationId - The ID of the coach application to be reviewed.
 *
 * @returns {Promise<{ success?: string, error?: string }>} A promise that resolves to an object indicating the success
 *   or failure of the operation. If successful, an object containing a success message is returned;
 *   otherwise, an object with an error message is returned.
 */

export async function reviewCoachApplication(
	values: z.infer<typeof ReviewCoachApplicationSchema>,
	applicationId: string
) {
	const validatedFields = ReviewCoachApplicationSchema.safeParse(values);

	if (!validatedFields.success) {
		return {
			error: 'An error occurred reviewing this coaches application, please try again later.',
		};
	}

	const reviewer = await currentUser();

	if (!reviewer) {
		return { error: 'User not found' };
	}

	const [coachApplicationResponse] = await db
		.select()
		.from(coachApplication)
		.where(eq(coachApplication.id, applicationId));

	if (!coachApplicationResponse) {
		return { error: 'Coach application not found' };
	}

	

	const { status } = validatedFields.data;

	// Review the coach application

	const [coachResponse] = await db
		.select()
		.from(coach)
		.where(eq(coach.id, coachApplicationResponse.coachId!));

	if (!coachResponse) {
		return { error: 'Coach not found' };
	}

	try {
		await db.transaction(async (trx) => {
			await trx
				.update(coachApplication)
				.set({
					status: status,
					reviewedAt: new Date(),
					reviewedBy: reviewer?.id,
				})
				.where(eq(coachApplication.id, coachApplicationResponse.id));

			if (status === 'APPROVED') {
				await trx
					.update(coach)
					.set({
						verified: new Date(),
					})
					.where(eq(coach.id, coachResponse.id));
			} else {
				await trx
					.update(coach)
					.set({
						verified: null,
					})
					.where(eq(coach.id, coachResponse.id));
			}
		});

		await sendCoachApplicationStatusEmail(coachApplicationResponse, status === 'APPROVED');

		return { success: 'Coach application reviewed' };
	} catch (error) {
		return { error: 'An error occurred while reviewing the coach application' };
	}
}
