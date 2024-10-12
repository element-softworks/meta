'use client';

import { X } from 'lucide-react';
import { useState } from 'react';

interface BannerProps {
	message: string;
	description?: string;
	variant?: 'destructive' | 'successful' | 'info';
	showOnce?: boolean;
}

export default function Banner({
	message,
	variant = 'info',
	description,
	showOnce = true,
}: BannerProps) {
	const variantClasses = {
		destructive: 'bg-destructive',
		successful: 'bg-successful',
		info: 'bg-blue-500',
	};

	const [alreadyDeclined, setAlreadyDeclined] = useState(
		typeof window !== 'undefined' &&
			!!localStorage.getItem(`banner-${message}`)?.length &&
			showOnce
	);

	const [open, setOpen] = useState(true);
	if (!message?.length || alreadyDeclined) return null;

	return (
		<div
			className={`fixed bottom-0 z-40 left-1/2 rounded-tr-md transition-all rounded-tl-md duration-300 -translate-x-1/2 p-6 px-4 w-[90%] md:w-fit lg:px-10
        ${variantClasses[variant]}
        ${open ? 'bottom-0 opacity-100' : '-bottom-20 opacity-0'}
        `}
		>
			<X
				onClick={() => {
					localStorage.setItem(`banner-${message}`, 'true');
					setOpen(false);
				}}
				className="absolute cursor-pointer text-destructive-foreground top-2 right-2"
				size={24}
			/>
			<p className="text-destructive-foreground font-bold">{message}</p>
			{description && <p className="text-destructive-foreground text-sm">{description}</p>}
		</div>
	);
}
