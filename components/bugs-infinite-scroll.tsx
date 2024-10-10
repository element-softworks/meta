'use client';

import { useParam } from '@/hooks/use-param';
import { ExtendedUser } from '@/next-auth';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ClipLoader } from 'react-spinners';
import { MarkNotificationReadIcon } from './buttons/mark-notification-read-icon';
import { Bug } from '@/db/drizzle/schema/bug';

interface BugsInfiniteScrollProps {
	bugs: Bug[] | null;
	total: number;
	user: ExtendedUser | undefined;
	perPage: number;
}
export const BugsInfiniteScroll = (props: BugsInfiniteScrollProps) => {
	const { mutateParam } = useParam();

	const handleNext = async () => {
		await mutateParam({ param: 'perPage', value: String(props.perPage + 10), scroll: false });
	};

	return (
		<InfiniteScroll
			dataLength={props.bugs?.length ?? 0} //This is important field to render the next data
			next={() => {
				handleNext();
			}}
			height={500}
			hasMore={(props.bugs?.length ?? 0) < (props?.total ?? 0)}
			loader={
				<div className="mt-6">
					<ClipLoader className="m-auto" size={25} />
				</div>
			}
			endMessage={<p className="mt-6 font-semibold">No more bugs to see</p>}
		>
			<div className="mt-6">
				{props.bugs?.map?.((notification, index) => (
					<div
						key={index}
						className="mb-4  pb-4 last:mb-0 last:pb-0 flex gap-4 flex-col sm:flex-row"
					>
						<div className="flex-1 items-center flex gap-2 flex-wrap">
							<div className="space-y-1">
								<p className="text-sm font-medium leading-none">
									{notification.title}
								</p>
								<p className="text-sm text-muted-foreground">
									{notification.description}
								</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</InfiniteScroll>
	);
};
