import { GeneralLayout, PoliciesLayout } from '@/components/layouts';
import PoliciesTableContainer from '@/components/tables/policies-table-container';
import { UploadCSVAction } from '@/components/uploads/upload-csv-action';

export async function generateMetadata() {
	return {
		title: `Policies | Dashboard Meta Retail Manager`,
		description: 'Manage and view stores for Meta.',
		openGraph: {
			title: `Policies | Dashboard Meta Retail Manager`,
			description: 'Manage and view stores for Meta.',
		},
		twitter: {
			title: `Policies | Dashboard Meta Retail Manager`,
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
		<GeneralLayout
			crumbs={[
				{
					active: true,
					text: `Uploads`,
					default: 'Uploads',
				},
			]}
		>
			<UploadCSVAction />
		</GeneralLayout>
	);
}
