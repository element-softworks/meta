'use server';

import { getUserNotifications } from '@/actions/get-user-notifications';
import { Separator } from '@/components/ui/separator';
import { currentUser } from '@/lib/auth';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BellRing, Check } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { MarkNotificationsReadButton } from './buttons/mark-notifications-read-button';
import { MarkNotificationReadIcon } from './buttons/mark-notification-read-icon';

export const NotificationsContainer = async () => {
	const user = await currentUser();

	const notifications = await getUserNotifications(user?.id ?? '');

	return (
		<Card>
			<CardHeader>
				<CardTitle>Notifications</CardTitle>
				<CardDescription>
					{!!notifications?.length
						? `You have ${notifications?.length} unread notifications`
						: 'You have no notifications to read'}
				</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-4">
				<div className=" flex flex-col sm:flex-row sm:items-center gap-4 rounded-md border p-4">
					<BellRing />
					<div className="flex-1 space-y-1">
						<p className="text-sm font-medium leading-none">
							Email notifications enabled
						</p>
						<p className="text-sm text-muted-foreground">
							Control whether you receive email notifications
						</p>
					</div>
					<Switch checked={user?.notificationsEnabled ?? false} />
				</div>
				<div className="mt-6">
					{notifications?.map?.((notification, index) => (
						<div key={index} className="mb-4  pb-4 last:mb-0 last:pb-0 flex gap-4">
							<div className="flex-1 items-center flex gap-2">
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
			</CardContent>
			<CardFooter>
				<MarkNotificationsReadButton
					notificationIds={notifications?.map((n) => n.id) ?? []}
				/>
			</CardFooter>
		</Card>
	);
};
