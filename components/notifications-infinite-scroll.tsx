'use client';

import { useParam } from '@/hooks/use-param';
import { ExtendedUser } from '@/next-auth';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ClipLoader } from 'react-spinners';
import { EmailNotificationsToggleButton } from './buttons/email-notifications-toggle-button';
import { MarkNotificationReadIcon } from './buttons/mark-notification-read-icon';
import { GetUserNotificationsResponse } from '@/actions/get-user-notifications';

interface NotificationsInfiniteScrollProps {
	notifications: GetUserNotificationsResponse | null;
	user: ExtendedUser | undefined;
	perPage: number;
}
export const NotificationsInfiniteScroll = (props: NotificationsInfiniteScrollProps) => {
	const { mutateParam } = useParam();

	const handleNext = async () => {
		await mutateParam({ param: 'perPage', value: String(props.perPage + 10), scroll: false });
	};

	return (
		<InfiniteScroll
			dataLength={props.notifications?.notifications?.length ?? 0} //This is important field to render the next data
			next={() => {
				handleNext();
			}}
			height={500}
			hasMore={
				(props.notifications?.notifications?.length ?? 0) <
				(props.notifications?.total ?? 0)
			}
			loader={
				<div className="mt-6">
					<ClipLoader className="m-auto" size={25} />
				</div>
			}
			endMessage={<p className="mt-6 font-semibold">No more notifications to see</p>}
		>
			<EmailNotificationsToggleButton
				checked={props.user?.notificationsEnabled ?? false}
				userId={props.user?.id ?? ''}
			/>

			<div className="mt-6">
				{props.notifications?.notifications?.map?.((notification, index) => (
					<div
						key={index}
						className="mb-4  pb-4 last:mb-0 last:pb-0 flex gap-4 flex-col sm:flex-row"
					>
						<div className="flex-1 items-center flex gap-2 flex-wrap">
							<span
								className={`flex h-3 w-3 self-start translate-y-1 rounded-full transition-all ${
									!!notification?.readAt ? 'bg-green-500' : 'bg-sky-500'
								} `}
							/>
							<div className="space-y-1">
								<p className="text-sm font-medium leading-none">
									{notification.title}
								</p>
								<p className="text-sm text-muted-foreground">
									{notification.message}
								</p>
							</div>
						</div>

						<MarkNotificationReadIcon
							notificationId={notification.id}
							visible={!notification?.readAt}
						/>
					</div>
				))}
			</div>
		</InfiniteScroll>
	);
};
