'use client';

import { useMutation } from '@/hooks/use-mutation';
import { Check } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Button } from '../ui/button';
import { markUserNotificationsRead } from '@/actions/account/mark-user-notifications-read';

interface MarkNotificationsReadButtonProps {
	notificationIds: string[];
	disabled?: boolean;
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
		<div
			onClick={() => {
				!props.disabled && handleMarkNotificationsRead();
			}}
			className="w-full"
		>
			<Button disabled={isLoading || props.disabled} isLoading={isLoading} className="w-full">
				<Check className="mr-2 h-4 w-4" /> Mark all as read
			</Button>
		</div>
	);
};
