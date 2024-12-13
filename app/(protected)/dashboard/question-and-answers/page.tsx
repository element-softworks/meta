import { GeneralLayout } from '@/components/layouts';
import { AnswersTable } from '@/components/tables/answers-table';
import AnswersTableContainer from '@/components/tables/answers-table-container';
import { QuestionsTable } from '@/components/tables/questions-table';
import QuestionsTableContainer from '@/components/tables/questions-table-container';
import { UsersTable } from '@/components/tables/users-table';
import UsersTableContainer from '@/components/tables/users-table-container';
import { Separator } from '@/components/ui/separator';
import { Suspense } from 'react';

export async function generateMetadata() {
	return {
		title: `Question and Answers | Admin | Dashboard Meta Retail Manager`,
		description: 'View and manage platform Question and Answers here',
		openGraph: {
			title: `Question and Answers | Admin | Dashboard Meta Retail Manager`,
			description: 'View and manage platform Question and Answers here',
		},
		twitter: {
			title: `Question and Answers | Admin | Dashboard Meta Retail Manager`,
			description: 'View and manage platform users here',
		},
	};
}

export default async function QuestionAndAnswersPage({ searchParams }: { searchParams: any }) {
	return (
		<GeneralLayout
			crumbs={[
				{
					active: true,
					text: `Question and Answers`,
					default: 'Question and Answers',
				},
			]}
		>
			<main className="flex flex-col  gap-4">
				<div className="">
					<p className="text-xl font-bold">Question and Answers</p>
					<p className="text-muted-foreground text-sm">
						View and manage platform question and answers here
					</p>
				</div>

				<Separator />

				<Suspense
					fallback={<QuestionsTable questions={[]} totalPages={1} isLoading={true} />}
				>
					<QuestionsTableContainer searchParams={searchParams} />
				</Suspense>

				<Suspense fallback={<AnswersTable answers={[]} totalPages={1} isLoading={true} />}>
					<AnswersTableContainer searchParams={searchParams} />
				</Suspense>
			</main>
		</GeneralLayout>
	);
}
