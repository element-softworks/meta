'use client';

import { useCurrentUser } from '@/hooks/use-current-user';
import { useSessionTracker } from '@/hooks/use-session-tracker';
import { redirect } from 'next/navigation';

export function SessionTrackerProvider({ children }: Readonly<{ children: React.ReactNode }>) {
	const user = useCurrentUser();
	useSessionTracker(user?.email ?? '', user?.currentTeam);

	return <>{children}</>;
}
