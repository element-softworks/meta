import SalesChartContainer from '@/components/charts/sales-chart-container';
import { Suspense, lazy } from 'react';
import { ClipLoader } from 'react-spinners';
import RecentSalesContainer from './recent-sales-container';

const NewPaymentsChartContainer = lazy(
	() => import('@/components/charts/new-subscriptions-chart-container')
);

const MonthlyRevenueDataCard = lazy(
	() => import('@/components/analytics/data-cards/monthly-revenue-data-card')
);
const TotalSubscriptionsDataCard = lazy(
	() => import('@/components/analytics/data-cards/total-subscriptions-data-card')
);
const SalesDataCard = lazy(() => import('@/components/analytics/data-cards/sales-data-card'));
export function PaymentsAnalytics({ searchParams }: { searchParams: any }) {
	return (
		<>
			<div className="flex flex-wrap gap-4 mt-4">
				<SalesDataCard />
				<MonthlyRevenueDataCard />
				<TotalSubscriptionsDataCard />
			</div>
			<Suspense
				fallback={
					<ClipLoader
						className="m-auto !border-t-primary !border-r-primary !border-l-primary"
						size={50}
					/>
				}
			>
				<SalesChartContainer searchParams={searchParams} />
			</Suspense>
			<div className="flex gap-4 flex-col xl:flex-row ">
				<div className="w-full xl:w-[60%]">
					<Suspense
						fallback={
							<ClipLoader
								className="m-auto !border-t-primary !border-r-primary !border-l-primary"
								size={50}
							/>
						}
					>
						<NewPaymentsChartContainer searchParams={searchParams} />
					</Suspense>
				</div>
				<div className="w-full xl:w-[40%]">
					<Suspense
						fallback={
							<ClipLoader
								className="m-auto !border-t-primary !border-r-primary !border-l-primary"
								size={50}
							/>
						}
					>
						<RecentSalesContainer />
					</Suspense>
				</div>
			</div>
		</>
	);
}
