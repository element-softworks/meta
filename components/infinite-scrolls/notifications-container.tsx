'use server';

import { getUserNotifications } from '@/actions/account/get-user-notifications';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { currentUser } from '@/lib/auth';
import { MarkNotificationsReadButton } from '../buttons/mark-notifications-read-button';
import { NotificationsInfiniteScroll } from './notifications-infinite-scroll';

export const NotificationsContainer = async ({
	searchParams,
}: {
	searchParams: { perPage: string };
}) => {
	const user = await currentUser();

	const notificationResponse = await getUserNotifications(
		user?.id ?? '',
		parseInt(searchParams?.perPage ?? 10),
		1
	);

	return (
		<>
			<div className="flex gap-2 items-center">
				<div className="flex-1">
					<p className="text-xl font-bold">Manage notifications</p>
					<p className="text-muted-foreground text-sm">
						You have {notificationResponse?.unreadCount ?? 0} unread notifications
					</p>
				</div>
			</div>
			<Separator />
			<Card>
				<CardContent className="grid gap-4 pt-4">
					<NotificationsInfiniteScroll
						notifications={notificationResponse}
						user={user}
						perPage={parseInt(searchParams?.perPage ?? 10)}
					/>
				</CardContent>
				<CardFooter>
					<MarkNotificationsReadButton
						disabled={notificationResponse?.unreadCount === 0}
						notificationIds={
							notificationResponse?.notifications?.map((n) => n.id) ?? []
						}
					/>
				</CardFooter>
			</Card>
		</>
	);
};
