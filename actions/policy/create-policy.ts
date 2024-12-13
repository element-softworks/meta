'use server';

import { db } from '@/db/drizzle/db';
import { policy, policyQuestion, store } from '@/db/drizzle/schema';
import { storeQuestion } from '@/db/drizzle/schema/storeQuestion';
import { checkPermissions } from '@/lib/auth';
import { PoliciesSchema } from '@/schemas';
import { inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';

export const createPolicy = async (values: z.infer<typeof PoliciesSchema>) => {
	const authData = await checkPermissions({ admin: true });

	const validatedFields = PoliciesSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: 'There was a problem creating the policy, please try again later' };
	}

	if (authData?.error) {
		return authData;
	} else {
		await db.transaction(async (trx) => {
			//Create the new policy
			const [newPolicy] = await trx
				.insert(policy)
				.values({
					createdBy: authData?.user?.id ?? '',
					updatedBy: authData?.user?.id ?? '',
					name: validatedFields?.data?.name,
				})
				.returning({ id: policy.id });
			//Update the stores with the new policyId
			const updatedStores = await trx
				.update(store)
				.set({ policyId: newPolicy?.id })
				.where(
					inArray(
						store.id,
						values?.stores?.map((store) => store.id)
					)
				)
				.returning();

			// //Create the new storeQuestions
			// updatedStores?.forEach(async (store) => {
			// 	await trx
			// 		.insert(storeQuestion)
			// 		.values(
			// 			values?.questions?.map((question) => ({
			// 				storeId: store.id,
			// 				questionId: question.id,
			// 			}))
			// 		)
			// 		.returning();
			// });

			//Create the new policyQuestions
			const newPolicyQuestions = await trx
				.insert(policyQuestion)
				.values(
					values?.questions?.map((question) => ({
						policyId: newPolicy?.id,
						questionId: question.id,
					}))
				)
				.returning();
		});
	}

	revalidatePath('/dashboard/policies');

	return { success: 'Policy created successfully' };
};
