'use client';

import { ArrowUp } from 'lucide-react';
import { Button } from '../ui/button';

export function ScrollTopButton() {
	return (
		<Button
			onClick={() => {
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}}
			variant="ghost"
			className="mt-2"
		>
			<ArrowUp className="text-primary" />
		</Button>
	);
}
