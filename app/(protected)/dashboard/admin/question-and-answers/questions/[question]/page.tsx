import { getQuestionById } from '@/actions/question-and-answers/get-question-by-id';
import { AnswersTable } from '@/components/tables/answers-table';
import AnswersTableContainer from '@/components/tables/answers-table-container';
import { Separator } from '@/components/ui/separator';
import { Suspense } from 'react';

export async function generateMetadata({ params }: { params: { question: string } }) {
	const questionResponse = await getQuestionById(params.question);

	return {
		title: `${questionResponse?.question?.questionText} Question and Answers | Admin | Dashboard | Meta`,
		description: 'View and manage platform Question and Answers here',
		openGraph: {
			title: `${questionResponse?.question?.questionText} Question and Answers | Admin | Dashboard | Meta`,
			description: 'View and manage platform Question and Answers here',
		},
		twitter: {
			title: `${questionResponse?.question?.questionText} Question and Answers | Admin | Dashboard | Meta`,
			description: 'View and manage platform users here',
		},
	};
}

export default async function QuestionAndAnswersPage({
	searchParams,
	params,
}: {
	searchParams: any;
	params: { question: string };
}) {
	const questionResponse = await getQuestionById(params.question);
	return (
		<main className="flex flex-col  gap-4">
			<div className="">
				<p className="text-xl font-bold">{questionResponse?.question?.questionText}</p>
				<p className="text-muted-foreground text-sm">
					View and manage the answers to this question.
				</p>
			</div>

			<Separator />

			{/* HEADER SECTION */}
			<section className="flex flex-wrap flex-row gap-4 lg:gap-8">
				<div className="flex flex-col gap-y-4">
					<div>
						<p className="font-medium text-muted-foreground">Cateogry</p>
						<p className="max-w-[35ch]">{questionResponse?.question?.category ?? ''}</p>
					</div>
				</div>

				<div className="flex flex-col gap-y-4">
					<div>
						<p className="font-medium text-muted-foreground">Question Type</p>
						<p className="max-w-[35ch]">
							{questionResponse?.question?.answerType.slice(0, 1) ?? ''}

							{questionResponse?.question?.answerType
								?.split('_')
								?.join(' ')
								?.toLocaleLowerCase()
								?.slice(+1) ?? ''}
						</p>
					</div>
				</div>

				<div className="flex flex-col gap-y-4">
					<div>
						<p className="font-medium text-muted-foreground">Fixture Related</p>
						<p className="max-w-[35ch]">
							{questionResponse?.question?.fixtureRelated ?? ''}
						</p>
					</div>
				</div>

				<div className="flex flex-col gap-y-4">
					<div>
						<p className="font-medium text-muted-foreground">Labels</p>
						<p className="max-w-[35ch]">{questionResponse?.question?.labels ?? ''}</p>
					</div>
				</div>
				<div className="flex flex-col gap-y-4">
					<div>
						<p className="font-medium text-muted-foreground">Note</p>
						<p className="max-w-[35ch]">{questionResponse?.question?.note ?? ''}</p>
					</div>
				</div>
			</section>

			<Suspense fallback={<AnswersTable answers={[]} totalPages={1} isLoading={true} />}>
				<AnswersTableContainer
					questionId={questionResponse?.question?.metaQuestionId ?? ''}
					searchParams={searchParams}
				/>
			</Suspense>
		</main>
	);
}
