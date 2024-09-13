'use client';

import { getUserNotificationsCount } from '@/actions/get-user-notifications-count';
import { useQuery } from '@/hooks/use-query';

interface NotificationsIconProps {
	userId: string;
	className?: string;
}

interface NotificationCountQueryResponse {
	count: number;
}
interface NotificationCountQueryRequest {
	userId?: number;
}

export function NotificationsIcon(props: NotificationsIconProps) {
	// Mock query function that simulates an API call

	const { data, isLoading } = useQuery<
		NotificationCountQueryRequest,
		NotificationCountQueryResponse
	>({
		queryFn: async () => await getUserNotificationsCount(props.userId),
		enabled: !!props.userId,
	});

	return (
		<div
			className={`transition-all bg-destructive rounded-full flex items-center justify-center text-destructive-foreground font-extrabold text-[0.6rem] size-5  ${
				props.className && props.className
			}
            ${!data?.count ? 'scale-50 opacity-0' : 'scale-100 opacity-100'}
            `}
		>
			{data?.count ?? 0}
		</div>
	);
}
