import { StoreResponse, getStores } from '@/actions/store/get-stores';
import { ClientInfiniteScroll } from '@/components/general/ClientInfiniteScroll';
import { CardWrapper } from '@/components/general/card-wrapper';
import { ImageCard } from '@/components/general/image-card';
import { ScrollTopButton } from '@/components/general/scroll-top-button';
import Image from 'next/image';
import countries from '@/countries.json';
import { SearchBar } from '@/components/general/search-bar';
import { Store } from '@/db/drizzle/schema/store';
import { CreateStoreAction } from '@/components/store/create-store-action';

export async function generateMetadata() {
	return {
		title: `Stores | Dashboard | Meta`,
		description: 'Manage and view stores for Meta.',
		openGraph: {
			title: `Stores | Dashboard | Meta`,
			description: 'Manage and view stores for Meta.',
		},
		twitter: {
			title: `Stores | Dashboard | Meta`,
			description: 'Manage and view stores for Meta.',
		},
	};
}

export default async function StoresPage({
	searchParams,
}: {
	searchParams: {
		perPage: string;
		pageNum: string;
		search: string;
	};
}) {
	const perPage = searchParams?.perPage ?? '20'; // Default to 12 if not specified
	const pageNum = searchParams?.pageNum ?? '1'; // Default to 1 if not specified

	const storesResponse = (await getStores(
		Number(perPage),
		Number(pageNum),
		searchParams.search
	)) as StoreResponse;

	return (
		<main className="flex flex-col  gap-4 h-full">
			<div className="flex gap-4 items-center flex-row">
				<h1 className="text-lg lg:text-xl font-medium md:flex-1">
					{storesResponse?.total ?? 0} Stores
				</h1>
				<SearchBar className="flex-1" placeholder="Search stores..." />
				<div className="md:flex-1 justify-end flex">
					<CreateStoreAction />
				</div>
			</div>

			<div className="">
				{!!storesResponse?.stores?.length || !!searchParams?.search?.length ? (
					<ClientInfiniteScroll
						increment={20}
						perPage={Number(perPage)}
						dataLength={storesResponse?.stores?.length ?? 0}
						hasMore={(storesResponse?.stores?.length ?? 0) < storesResponse?.total}
						endMessage={
							<div className="flex flex-col items-center">
								<p className="text-muted-foreground text-center mt-16">
									Showing all stores!
								</p>
								<ScrollTopButton />
							</div>
						}
					>
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
							{storesResponse?.stores?.map((storeData) => {
								const country = countries?.find(
									(country) =>
										country?.name === storeData?.store?.geolocation?.country
								);

								return (
									<ImageCard
										key={storeData?.store.id}
										title={storeData?.store?.name}
										subtitle={storeData?.store?.geolocation?.addressName}
										image={storeData?.store?.coverImageAsset ?? ''}
										link={`/dashboard/locations/${storeData?.store?.id}`}
										endIcon={
											country?.code && (
												<div className="flex gap-2">
													<Image
														className="rounded-full min-h-4 min-w-4 w-4 h-4 object-cover"
														unoptimized
														loading="lazy"
														width={500}
														height={500}
														src={`https://flagcdn.com/${country?.code?.toLowerCase()}.svg`}
														alt={`${country?.name} country flag`}
													/>
												</div>
											)
										}
									/>
								);
							})}
						</div>
					</ClientInfiniteScroll>
				) : (
					<div className="flex items-center justify-center mt-10">
						<div className="max-w-lg mx-auto">
							<CardWrapper
								title="Add your first location"
								description="Locations are what you will use to link thinks like cameras, kiosks and links to physical locations. "
							>
								{/* <CreateLocationAction button={<Button>Create location</Button>} /> */}
							</CardWrapper>
						</div>
					</div>
				)}
			</div>
		</main>
	);
}
