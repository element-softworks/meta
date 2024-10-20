import { CenteredLoader } from '@/components/layout/centered-loader';
import InvoicesTableContainer from '@/components/tables/invoices-table-container';
import { Separator } from '@/components/ui/separator';
import { getTeamById } from '@/data/team';
import { Suspense } from 'react';

export async function generateMetadata({ params }: any) {
	const teamResponse = await getTeamById(params.team);
	return {
		title: `Invoices | ${teamResponse?.data?.team.name} | Teams | Dashboard | NextJS SaaS Boilerplate`,
		description: `Invoices for ${teamResponse?.data?.team.name} on NextJS SaaS Boilerplate.`,
		openGraph: {
			title: `Invoices | ${teamResponse?.data?.team.name} | Teams | Dashboard | NextJS SaaS Boilerplate`,
			description: `Invoices for ${teamResponse?.data?.team.name} on NextJS SaaS Boilerplate.`,
		},
		twitter: {
			title: `Invoices | ${teamResponse?.data?.team.name} | Teams | Dashboard | NextJS SaaS Boilerplate`,
			description: `Invoices for ${teamResponse?.data?.team.name} on NextJS SaaS Boilerplate.`,
		},
	};
}

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
