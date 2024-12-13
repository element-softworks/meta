import { FixtureTypesResponse, getFixtureTypes } from '@/actions/fixture-type/get-fixture-types';
import { CreateFixtureTypeAction } from '@/components/fixture-types/create-fixture-type-action';
import { UpdateFixtureTypeAction } from '@/components/fixture-types/update-fixture-type-action';
import { RichTextRenderer } from '@/components/general/rich-text-renderer';
import { Separator } from '@/components/ui/separator';

export async function generateMetadata() {
	return {
		title: `Fixture Types | Admin |  Dashboard | Meta`,
		description: 'View and manage bugs for Meta.',
		openGraph: {
			title: `Fixture Types | Admin |  Dashboard | Meta`,
			description: 'View and manage bugs for Meta.',
		},
		twitter: {
			title: `Fixture Types | Admin |  Dashboard | Meta`,
			description: 'View and manage bugs for Meta.',
		},
	};
}

export default async function AdminTeamsPage({ searchParams }: { searchParams: any }) {
	const response = (await getFixtureTypes(10, 1, undefined, false)) as FixtureTypesResponse;

	console.log(response, 'response data');
	return (
		<main className="flex flex-col  gap-4">
			<div className="">
				<p className="text-xl font-bold">Fixture types</p>
				<p className="text-muted-foreground text-sm">View and manage fixture types here</p>
			</div>

			<Separator />

			<CreateFixtureTypeAction />

			{response?.fixtureTypes?.map?.((fixture, index) => {
				return (
					<div className="border p-4 rounded-lg relative">
						<div className="absolute top-4 right-4">
							<UpdateFixtureTypeAction fixtureType={fixture} />
						</div>
						<p className="text-xl font-bold">{fixture.name}</p>
						<RichTextRenderer key={index} content={fixture.description} />
					</div>
				);
			})}
		</main>
	);
}
