import { getStoreById } from '@/actions/store/get-store-by-id';
import { Map } from '@/components/general/map';
import { StoresLayout } from '@/components/layouts';
import { ArchiveStoreAction } from '@/components/store/archive-store-action';
import { EditStoreAction } from '@/components/store/edit-store-action';
import { ReviewStoreAction } from '@/components/store/review-store-action';
import { ReviewStoreActionContainer } from '@/components/store/review-store-action-container';
import { Separator } from '@/components/ui/separator';
import { db } from '@/db/drizzle/db';
import { store } from '@/db/drizzle/schema';
import { currentUser } from '@/lib/auth';
import { convertHourToAMPM } from '@/lib/utils';
import { getDay } from 'date-fns';
import { eq } from 'drizzle-orm';
import { Lock, LockOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export async function generateMetadata({ params }: any) {
	const [storeResponse] = await db.select().from(store).where(eq(store.id, params.store));

	return {
		title: `${storeResponse?.name} | Stores | Dashboard | Meta`,
		description: `${storeResponse?.name}`,
		openGraph: {
			title: `${storeResponse?.name} | Stores | Dashboard | Meta`,
			description: `${storeResponse?.name}`,
		},
		twitter: {
			title: `${storeResponse?.name} | Stores | Dashboard | Meta`,
			description: `${storeResponse?.name}`,
		},
	};
}

export default async function LocationPage({
	params,
	searchParams,
}: {
	params: { organisation: string; store: string };
	searchParams: any;
}) {
	const user = await currentUser();
	const storeResponse = await getStoreById(params.store);

	const perPage = searchParams?.['links-perPage'] ?? '5';
	const pageNum = searchParams?.['links-pageNum'] ?? '1';

	const isAdmin = user?.role === 'ADMIN';
	const currentDate = new Date();
	const dayIndex = getDay(currentDate) - 1;
	const currentLocationDay = storeResponse?.store?.openingTimes?.[dayIndex];
	const locationClosed = currentLocationDay?.[0][0] === 0;

	return (
		<StoresLayout
			crumbs={[
				{
					active: false,
					text: `Stores`,
				},
				{
					active: true,
					text: `Store`,
				},
			]}
		>
			<div className="flex flex-col  gap-4 h-full">
				<div className="flex gap-4">
					<h1 className="text-lg lg:text-xl font-medium flex-1">
						{storeResponse?.store?.name}
					</h1>
					<div className="flex gap-2">
						<ArchiveStoreAction store={storeResponse?.store} />
						<EditStoreAction store={storeResponse?.store} />
						<ReviewStoreActionContainer store={storeResponse} />
					</div>
				</div>

				{/* HEADER SECTION */}
				<section className="flex flex-col md:flex-row gap-4">
					<Image
						unoptimized
						src={storeResponse?.store?.coverImageAsset ?? ''}
						alt={`${storeResponse?.store?.name} image`}
						height={200}
						width={200}
						layout="responsive"
						className="rounded-lg aspect-video max-w-[300px] object-cover w-auto bg-card"
					/>
					<div className="flex flex-col gap-y-4">
						<div>
							<p className="font-medium text-muted-foreground">Address</p>
							<p className="max-w-[35ch]">
								{storeResponse?.store?.address?.addressName ?? ''}
							</p>
						</div>

						<div>
							<p className="font-medium text-muted-foreground">Opening times</p>
							<div className="flex gap-2 items-center">
								{locationClosed ? (
									<Lock size={14} className="text-destructive" />
								) : (
									<LockOpen size={14} className="text-successful" />
								)}
								<p className="">{locationClosed ? 'Closed' : 'Open'}</p>
								<p className="text-sm text-muted-foreground font-medium">
									{locationClosed ? (
										''
									) : (
										<>
											{convertHourToAMPM(currentLocationDay?.[0][0] ?? 0)}-
											{convertHourToAMPM(currentLocationDay?.[0][1] ?? 0)}{' '}
										</>
									)}
									today
								</p>
							</div>
						</div>
					</div>

					{!!storeResponse?.linkedPolicy?.id ? (
						<div>
							<p className="font-medium text-muted-foreground">Linked policy</p>
							<Link href={`/dashboard/policies/${storeResponse?.linkedPolicy?.id}`}>
								<p className="max-w-[35ch]">
									{storeResponse?.linkedPolicy?.name ?? ''}
								</p>
							</Link>
						</div>
					) : null}
				</section>

				<div>
					<Separator className="my-4 -mx-4 w-[105%]" />
				</div>

				<div className="flex flex-col gap-6">
					{/* MAP SECTION */}
					<aside>
						<Map
							draggableMarker={false}
							expandable
							directions
							title="Address"
							description={storeResponse?.store?.address?.addressName}
							lat={storeResponse?.store?.address?.latitude ?? 0}
							lng={storeResponse?.store?.address?.longitude ?? 0}
							zoom={16}
						/>
					</aside>
				</div>
			</div>
		</StoresLayout>
	);
}
