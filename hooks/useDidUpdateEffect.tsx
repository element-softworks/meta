import { useEffect, useRef } from 'react';

export default (fn: () => void, inputs: any[]): void => {
	const didMountRef = useRef(false);

	useEffect(() => {
		if (didMountRef.current) fn();
		else didMountRef.current = true;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, inputs);
};
