'use server';

import { db } from '@/db/drizzle/db';
import { answer, question, store, storeGeolocation } from '@/db/drizzle/schema';
import questionAndAnswers from './question-and-answers.json';
import { checkPermissions } from '@/lib/auth';

/**
 * Seed stores
 * @param {Object} options
 */

export const seedQuestionAndAnswers = async () => {
	// Parse stores and geolocations
	const authData = await checkPermissions({ admin: true });

	console.log(authData, 'auth data');

	if (authData?.error) {
		return authData;
	} else {
		const parsedQuestions = questionAndAnswers.data.reduce(
			(acc: any[], questionAnswer: any) => {
				const metaQuestionId = questionAnswer?.['Meta Question ID'];
				const existingQuestion = acc.find((q) => q.metaQuestionId === metaQuestionId);
				if (!existingQuestion) {
					acc.push({
						category: questionAnswer?.['Category'],
						metaQuestionId,
						questionText: questionAnswer?.['Question Text'],
						answerType: questionAnswer?.['Answer Type']
							?.split(' ')
							?.join('_')
							?.toUpperCase(),
						note: questionAnswer?.['Note'],
						fixtureRelated: questionAnswer?.['Fixture-Related'],
						labels: questionAnswer?.['Labels'],
						createdAt: new Date(),
						updatedAt: new Date(),
						createdBy: authData?.user?.id ?? '',
						updatedBy: authData?.user?.id ?? '',
					});
				}
				return acc;
			},
			[]
		);

		const parsedAnswers = questionAndAnswers.data.map((questionAnswer: any) => ({
			answer: questionAnswer?.['Answer'],
			metaChoiceId: questionAnswer?.['Meta Choice ID'],
			questionId: questionAnswer?.['Meta Question ID'],
			createdAt: new Date(),
			updatedAt: new Date(),
			createdBy: authData?.user?.id ?? '',
			updatedBy: authData?.user?.id ?? '',
		}));

		try {
			await db.transaction(async (trx) => {
				await trx.delete(answer);
				await trx.delete(question);

				// Insert question entries
				await trx.insert(question).values(parsedQuestions);

				// Insert answer entries
				await trx.insert(answer).values(parsedAnswers);
			});

			return { success: 'Question and answers seeded successfully' };
		} catch (error: any) {
			console.error('error seeding question and answers', error);
			return { error: error.message };
		}
	}
};
