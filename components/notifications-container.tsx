'use server';

import { getUserNotifications } from '@/actions/get-user-notifications';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { currentUser } from '@/lib/auth';
import { MarkNotificationsReadButton } from './buttons/mark-notifications-read-button';
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
		<Card>
			<CardHeader>
				<CardTitle>Notifications</CardTitle>
				<CardDescription>
					{!!notificationResponse?.notifications?.length
						? `You have ${notificationResponse.unreadCount ?? 0} unread notifications`
						: 'You have no notifications to read'}
				</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-4">
				<NotificationsInfiniteScroll
					notifications={notificationResponse}
					user={user}
					perPage={parseInt(searchParams?.perPage ?? 10)}
				/>
			</CardContent>
			<CardFooter>
				<MarkNotificationsReadButton
					disabled={notificationResponse?.unreadCount === 0}
					notificationIds={notificationResponse?.notifications?.map((n) => n.id) ?? []}
				/>
			</CardFooter>
		</Card>
	);
};
