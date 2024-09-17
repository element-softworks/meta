'use client';

import { markUserNotificationsRead } from '@/actions/mark-user-notifications-read';
import { useMutation } from '@/hooks/use-mutation';
import { Button } from '../ui/button';
import { Check } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface MarkNotificationsReadButtonProps {
	notificationIds: string[];
}

type MarkNotificationsReadButtonRequest = {
	notificationIds: string[];
};

export const MarkNotificationsReadButton = (props: MarkNotificationsReadButtonProps) => {
	const { update } = useSession();
	const { query: markNotificationQuery, isLoading } = useMutation<
		MarkNotificationsReadButtonRequest,
		{}
	>({
		queryFn: async (values) => await markUserNotificationsRead({ all: true }),
	});

	const handleMarkNotificationsRead = async () => {
		if (!props.notificationIds.length) return;

		await markNotificationQuery();
		update();
	};

	return (
		<div onClick={() => handleMarkNotificationsRead()} className="w-full">
			<Button disabled={isLoading} isLoading={isLoading} className="w-full">
				<Check className="mr-2 h-4 w-4" /> Mark all as read
			</Button>
		</div>
	);
};
