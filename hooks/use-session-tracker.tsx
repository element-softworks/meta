'use client';

import { trackSessions } from '@/actions/track-sessions';
import { useEffect, useState } from 'react';
import { useIdleTimer } from 'react-idle-timer';

export function useSessionTracker(email: string, currentTeam?: string) {
	const [state, setState] = useState<string>('Active');

	const onIdle = async () => {
		setState('Idle');
		await trackSessions(email ?? '', true);
	};

	const onActive = async () => {
		await trackSessions(email ?? '');
	};

	useIdleTimer({
		onIdle,
		onActive,
		crossTab: true,
		timeout: 300_000,
		throttle: 500,
	});

	useEffect(() => {
		if (state === 'Idle') return;
		(async () => {
			await trackSessions(email ?? '');
		})();
	}, [state]);
}
