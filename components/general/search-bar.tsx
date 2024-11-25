'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';
import { useParam } from '@/hooks/use-param';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SearchBarProps {
	id?: string; // The id to prefix on the query params
	placeholder?: string; // The placeholder text
	onValueChange?: (value: string) => void; // The function to call when the value changes
	className?: string; // The class name to apply to the search bar
	debouceDelay?: number; // The delay to debounce the search defaults to 500ms
}

export function SearchBar(props: SearchBarProps) {
	const hasSearched = useRef(false);
	const { debouceDelay = 500 } = props;
	const { mutateParam } = useParam();
	const searchParams = useSearchParams();

	const [value, setValue] = useState<string>(
		searchParams.get(`${!!props.id?.length ? `${props.id}-` : ''}search`) ?? ''
	);

	// Debounce the params change
	useEffect(() => {
		if (!value?.length && !hasSearched?.current) return;
		const handler = setTimeout(() => {
			mutateParam({
				param: `${!!props.id?.length ? `${props.id}-` : ''}search`,
				value: value,
				scroll: false,
			});
		}, debouceDelay);

		hasSearched.current = true;

		return () => {
			clearTimeout(handler);
		};
	}, [value]);

	return (
		<div className={cn('relative', props.className)}>
			<Input
				className=" placeholder:test-muted-foreground border border-border placeholder:font-medium"
				placeholder={props?.placeholder ?? 'Search...'}
				value={value}
				onChange={(e) => {
					setValue(e.target.value);
				}}
			/>
			<Search
				size={18}
				className="absolute right-4 test-muted-foreground top-1/2 -translate-y-1/2"
			/>
		</div>
	);
}
