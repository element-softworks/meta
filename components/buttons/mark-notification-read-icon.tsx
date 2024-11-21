'use client';

import { markUserNotificationsRead } from '@/actions/account/mark-user-notifications-read';
import { useMutation } from '@/hooks/use-mutation';
import { Button } from '../ui/button';
import { Check } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface MarkNotificationReadIconProps {
	notificationId: string;
	visible?: boolean;
}

type MarkNotificationReadIconRequest = {
	notificationIds: string[];
};

export const MarkNotificationReadIcon = (props: MarkNotificationReadIconProps) => {
	const { update } = useSession();

	const { visible = true } = props;
	const { query: markNotificationQuery, isLoading } = useMutation<
		MarkNotificationReadIconRequest,
		{}
	>({
		queryFn: async (values) =>
			await markUserNotificationsRead({ notificationIds: [props.notificationId] }),
	});

	const handleMarkNotificationsRead = async () => {
		if (!props.notificationId) return;

		await markNotificationQuery();
		update();
	};

	return (
		<div
			onClick={() => visible && handleMarkNotificationsRead()}
			className={`${visible ? 'opacity-100' : 'opacity-0 cursor-default'} transition-all`}
		>
			<Button
				variant="ghost"
				className={visible ? '' : 'cursor-default'}
				disabled={isLoading}
				isLoading={isLoading}
			>
				<Check className="mr-2 h-4 w-4" /> Mark read
			</Button>
		</div>
	);
};
