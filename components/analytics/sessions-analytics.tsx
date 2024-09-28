import { BookUser, Radio, Users, Users2 } from 'lucide-react';
import { Suspense, lazy } from 'react';
import { ClipLoader } from 'react-spinners';

const SessionsChartContainer = lazy(() => import('@/components/charts/sessions-chart-container'));
const SessionsDataCard = lazy(() => import('@/components/analytics/data-cards/sessions-data-card'));
const UniqueSessionsDataCard = lazy(
	() => import('@/components/analytics/data-cards/unique-sessions-data-card')
);

export function SessionsAnalytics({ searchParams }: { searchParams: any }) {
	return (
		<>
			<div className="flex flex-wrap gap-4 mt-4">
				<SessionsDataCard
					variant="now"
					title="Sessions now"
					subtitle="Live"
					icon={<Radio size={20} />}
				/>
				<SessionsDataCard
					variant="today"
					title="Total sessions"
					subtitle="From today"
					icon={<Users size={20} />}
				/>
				<SessionsDataCard
					variant="week"
					title="Total sessions"
					subtitle="Past week"
					icon={<Users2 size={20} />}
				/>

				<UniqueSessionsDataCard
					title="Unique sessions"
					subtitle="Past month"
					icon={<BookUser size={20} />}
				/>
			</div>

			<Suspense
				fallback={
					<ClipLoader
						className="m-auto !border-t-primary !border-r-primary !border-l-primary"
						size={50}
					/>
				}
			>
				<SessionsChartContainer searchParams={searchParams} />
			</Suspense>
		</>
	);
}
