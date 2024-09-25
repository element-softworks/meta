'use client';

import { useCurrentUser } from '@/hooks/use-current-user';
import { useSessionTracker } from '@/hooks/use-session-tracker';

export function SessionTrackerProvider({ children }: Readonly<{ children: React.ReactNode }>) {
	const user = useCurrentUser();
	useSessionTracker(user?.email ?? '');

	return <>{children}</>;
}
