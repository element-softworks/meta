'use client';

import { trackSessions } from '@/actions/track-sessions';
import { useEffect } from 'react';

export function useSessionTracker(userId: string) {
	//Track user sessions app wide
	useEffect(() => {
		//Track the session the first time, then set a cookie and dont track it after that

		(async () => {
			//If no session cookie, track the session
			await trackSessions(userId ?? '');
		})();
	}, []);
}
