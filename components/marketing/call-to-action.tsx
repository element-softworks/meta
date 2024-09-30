'use client';

import Link from 'next/link';
import { Button } from '../ui/button';

interface CallToActionProps {
	title: string;
	description: string;
}

export function CallToAction(props: CallToActionProps) {
	return (
		<section className="flex flex-col items-start md:items-center gap-4 md:gap-8">
			<h2 className="w-full text-start md:text-center font-semibold text-2xl md:text-4xl lg:text-5xl max-w-[22ch]">
				{props.title}
			</h2>
			<p className="text-start md:text-center text-base md:text-lg text-muted-foreground max-w-[65ch]">
				{props.description}
			</p>

			<Link href="/auth/register">
				<Button size="lg" className="w-fit">
					Start your journey today
				</Button>
			</Link>
		</section>
	);
}
