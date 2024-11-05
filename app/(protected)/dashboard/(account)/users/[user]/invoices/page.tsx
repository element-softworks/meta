import { CenteredLoader } from '@/components/layout/centered-loader';
import InvoicesTableContainer from '@/components/tables/invoices-table-container';
import { Separator } from '@/components/ui/separator';
import { getUserById } from '@/data/user';
import { Suspense } from 'react';

export async function generateMetadata({ params }: any) {
	const userResponse = await getUserById(params.user);
	return {
		title: `Invoices | ${userResponse?.name} | Users | Dashboard | NextJS SaaS Boilerplate`,
		description: `Invoices for ${userResponse?.name} on NextJS SaaS Boilerplate.`,
		openGraph: {
			title: `Invoices | ${userResponse?.name} | Users | Dashboard | NextJS SaaS Boilerplate`,
			description: `Invoices for ${userResponse?.name} on NextJS SaaS Boilerplate.`,
		},
		twitter: {
			title: `Invoices | ${userResponse?.name} | Users | Dashboard | NextJS SaaS Boilerplate`,
			description: `Invoices for ${userResponse?.name} on NextJS SaaS Boilerplate.`,
		},
	};
}

export default async function BillingPage({
	params,
	searchParams,
}: {
	params: { user: string };
	searchParams: any;
}) {
	return (
		<main className="flex flex-col  gap-4 h-full">
			<div className="flex gap-2 items-center">
				<div className="flex-1">
					<p className="text-xl font-bold">Invoices</p>
					<p className="text-muted-foreground text-sm max-w-xl">
						Manage and view your invoices here.
					</p>
				</div>
			</div>
			<Separator />

			<Suspense fallback={<CenteredLoader />}>
				<InvoicesTableContainer userId={params.user} searchParams={searchParams} />
			</Suspense>
		</main>
	);
}
