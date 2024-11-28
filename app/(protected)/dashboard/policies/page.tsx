import { PoliciesLayout } from '@/components/layouts';
import PoliciesTableContainer from '@/components/tables/policies-table-container';

export async function generateMetadata() {
	return {
		title: `Policies | Dashboard | Meta`,
		description: 'Manage and view stores for Meta.',
		openGraph: {
			title: `Policies | Dashboard | Meta`,
			description: 'Manage and view stores for Meta.',
		},
		twitter: {
			title: `Policies | Dashboard | Meta`,
			description: 'Manage and view stores for Meta.',
		},
	};
}

export default async function PoliciesPage({
	searchParams,
}: {
	searchParams: {
		perPage: string;
		pageNum: string;
		search: string;
		archived: string;
	};
}) {
	const perPage = searchParams?.perPage ?? '20'; // Default to 12 if not specified
	const pageNum = searchParams?.pageNum ?? '1'; // Default to 1 if not specified

	return (
		<PoliciesLayout
			crumbs={[
				{
					active: true,
					text: `Policies`,
					default: 'Policies',
				},
			]}
		>
			<PoliciesTableContainer searchParams={searchParams} />
		</PoliciesLayout>
	);
}
