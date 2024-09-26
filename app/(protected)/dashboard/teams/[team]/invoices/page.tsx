import { CenteredLoader } from '@/components/layout/centered-loader';
import InvoicesTableContainer from '@/components/tables/invoices-table-container';
import { Separator } from '@/components/ui/separator';
import { Suspense } from 'react';

export default async function BillingPage({
	params,
	searchParams,
}: {
	params: { team: string };
	searchParams: any;
}) {
	return (
		<main className="flex flex-col  gap-4 h-full">
			<div className="flex gap-2 items-center">
				<div className="flex-1">
					<p className="text-xl font-bold">Team invoices</p>
					<p className="text-muted-foreground text-sm max-w-xl">
						Manage and view your team{"'"}s invoices here.
					</p>
				</div>
			</div>
			<Separator />

			<Suspense fallback={<CenteredLoader />}>
				<InvoicesTableContainer teamId={params.team} searchParams={searchParams} />
			</Suspense>
		</main>
	);
}
