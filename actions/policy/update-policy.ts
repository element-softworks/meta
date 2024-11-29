'use server';

import { db } from '@/db/drizzle/db';
import { policy, policyQuestion, policyStore } from '@/db/drizzle/schema';
import { checkPermissions } from '@/lib/auth';
import { PoliciesSchema } from '@/schemas';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';

export const updatePolicy = async (values: z.infer<typeof PoliciesSchema>, policyId: string) => {
	const authData = await checkPermissions({ admin: true });

	const validatedFields = PoliciesSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: 'There was a problem creating the policy, please try again later' };
	}

	if (authData?.error) {
		return authData;
	} else {
		await db.transaction(async (trx) => {
			await trx.delete(policyStore).where(eq(policyStore.policyId, policyId));
			await trx.delete(policyQuestion).where(eq(policyQuestion.policyId, policyId));

			//Create the new policy
			const [foundPolicy] = await trx
				.update(policy)
				.set({
					createdBy: authData?.user?.id ?? '',
					updatedBy: authData?.user?.id ?? '',
					name: validatedFields?.data?.name,
				})
				.where(eq(policy.id, policyId))
				.returning({ id: policy.id });

			//Create the new policyStores
			const newPolicyStores = await trx
				.insert(policyStore)
				.values(
					values?.stores?.map((store) => ({
						policyId: foundPolicy?.id,
						storeId: store.id,
					}))
				)
				.returning();

			//Create the new policyQuestions
			const newPolicyQuestions = await trx
				.insert(policyQuestion)
				.values(
					values?.questions?.map((question) => ({
						policyId: foundPolicy?.id,
						questionId: question.id,
					}))
				)
				.returning();
		});
	}

	revalidatePath('/dashboard/policies');

	return { success: 'Policy updated successfully' };
};
