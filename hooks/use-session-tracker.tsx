'use client';

import { trackSessions } from '@/actions/track-sessions';
import { useEffect, useState } from 'react';
import { useIdleTimer } from 'react-idle-timer';

export function useSessionTracker(email: string) {
	const [state, setState] = useState<string>('Active');
	const [remaining, setRemaining] = useState<number>(0);

	const onIdle = async () => {
		console.log('User is idle');
		await trackSessions(email ?? '', true);
	};

	const onActive = async () => {
		console.log('User is active');
		await trackSessions(email ?? '');
	};

	const { getRemainingTime } = useIdleTimer({
		onIdle,
		onActive,
		crossTab: true,
		timeout: 300_000,
		throttle: 500,
	});

	useEffect(() => {
		const interval = setInterval(() => {
			setRemaining(Math.ceil(getRemainingTime() / 1000));
		}, 500);

		return () => {
			clearInterval(interval);
		};
	});

	useEffect(() => {
		(async () => {
			await trackSessions(email ?? '');
		})();
	}, []);
}
