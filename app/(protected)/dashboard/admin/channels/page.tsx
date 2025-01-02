import { ChannelsResponse, getChannels } from '@/actions/channel/get-channels';
import { FixtureTypesResponse, getFixtureTypes } from '@/actions/fixture-type/get-fixture-types';
import { ArchiveChannelAction } from '@/components/channels/archive-channel-action';
import { CreateChannelAction } from '@/components/channels/create-channel-action';
import { UpdateChannelAction } from '@/components/channels/update-channel-action';
import { CreateFixtureTypeAction } from '@/components/fixture-types/create-fixture-type-action';
import { FixtureTypeCard } from '@/components/fixture-types/fixture-type-card';
import { ShowArchivedButton } from '@/components/general/show-archived-button';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

export async function generateMetadata() {
	return {
		title: `Channels | Admin |  Dashboard Meta Retail Manager`,
		description: 'View and manage bugs for Meta.',
		openGraph: {
			title: `Channels | Admin |  Dashboard Meta Retail Manager`,
			description: 'View and manage bugs for Meta.',
		},
		twitter: {
			title: `Channels | Admin |  Dashboard Meta Retail Manager`,
			description: 'View and manage bugs for Meta.',
		},
	};
}

export default async function AdminTeamsPage({ searchParams }: { searchParams: any }) {
	const response = (await getChannels(
		10,
		1,
		undefined,
		searchParams.archived === 'true'
	)) as ChannelsResponse;

	return (
		<main className="flex flex-col  gap-4">
			<div className="">
				<p className="text-xl font-bold">Channels</p>
				<p className="text-muted-foreground text-sm">View and manage channels here</p>
			</div>

			<Separator />
			<ShowArchivedButton />

			<CreateChannelAction />

			{response?.channels?.map?.((channel, index) => {
				return (
					<div
						key={index}
						className="border p-6 rounded-lg relative w-fit flex flex-col gap-4 min-w-60"
					>
						<div className="flex flex-row items-center gap-4">
							<div className="flex flex-row gap-1 items-center flex-1">
								<p className="text-xl font-medium">{channel?.name}</p>
							</div>
							<div className="flex flex-row gap-2 ">
								<ArchiveChannelAction channel={channel} />
								<UpdateChannelAction channel={channel} />
							</div>
						</div>
						{!!channel?.image ? (
							<Image
								src={channel?.image}
								alt={channel?.name}
								width={300}
								height={300}
								className="w-auto h-72 mx-auto rounded-lg object-contain"
							/>
						) : null}
					</div>
				);
			})}
		</main>
	);
}
