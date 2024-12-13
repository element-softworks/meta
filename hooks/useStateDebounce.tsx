import { Dispatch, SetStateAction, useRef, useState } from 'react';
import useDidUpdateEffect from './useDidUpdateEffect';

function useStateDebounce<T>(
	_data: T,
	debounceDelay: number,
	debouncedFn: (data: T) => any
): [T, Dispatch<SetStateAction<T>>] {
	const [data, setData] = useState<T>(_data);
	const timeout = useRef<NodeJS.Timeout | null>(null);

	useDidUpdateEffect(() => {
		if (timeout.current) clearTimeout(timeout.current);

		timeout.current = setTimeout(() => {
			debouncedFn(_data);
		}, debounceDelay);

		return () => {
			if (timeout.current) clearTimeout(timeout.current);
		};
	}, [_data, debounceDelay, debouncedFn]);

	return [data, setData];
}

export default useStateDebounce;
