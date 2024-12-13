import { FixtureTypesResponse, getFixtureTypes } from '@/actions/fixture-type/get-fixture-types';
import { CreateFixtureTypeAction } from '@/components/fixture-types/create-fixture-type-action';
import { FixtureTypeCard } from '@/components/fixture-types/fixture-type-card';
import { ShowArchivedButton } from '@/components/general/show-archived-button';
import { Separator } from '@/components/ui/separator';

export async function generateMetadata() {
	return {
		title: `Fixture Types | Admin |  Dashboard Meta Retail Manager`,
		description: 'View and manage bugs for Meta.',
		openGraph: {
			title: `Fixture Types | Admin |  Dashboard Meta Retail Manager`,
			description: 'View and manage bugs for Meta.',
		},
		twitter: {
			title: `Fixture Types | Admin |  Dashboard Meta Retail Manager`,
			description: 'View and manage bugs for Meta.',
		},
	};
}

export default async function AdminTeamsPage({ searchParams }: { searchParams: any }) {
	const response = (await getFixtureTypes(
		10,
		1,
		undefined,
		searchParams.archived === 'true'
	)) as FixtureTypesResponse;

	return (
		<main className="flex flex-col  gap-4">
			<div className="">
				<p className="text-xl font-bold">Fixture types</p>
				<p className="text-muted-foreground text-sm">View and manage fixture types here</p>
			</div>

			<Separator />
			<ShowArchivedButton />

			<CreateFixtureTypeAction />

			{response?.fixtureTypes?.map?.((fixture, index) => {
				return <FixtureTypeCard key={index} fixtureType={fixture} />;
			})}
		</main>
	);
}
