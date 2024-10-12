'use client';

interface StatusIconProps {
	status: 'successful' | 'destructive' | 'neutral';
}

export function StatusIcon(props: StatusIconProps) {
	return (
		<div
			className={`relative flex min-h-4 min-w-4 self-start translate-y-1 rounded-full drop-shadow-glow animate-glow transition-all ${
				props.status === 'successful'
					? '-inset-1 bg-gradient-to-r from-successful to-successful/70 blur  transition duration-1000 group-hover:duration-200'
					: props.status === 'destructive'
						? '-inset-1 bg-gradient-to-r from-destructive to-destructive/70 blur  transition duration-1000 group-hover:duration-200'
						: '-inset-1 bg-gradient-to-r from-blue-500 to-blue-500/70 blur  transition duration-1000 group-hover:duration-200'
			} 
			
			`}
		>
			<div
				className={`absolute top-0 left-0 inset-2 ring-2 size-4 rounded-full blur-sm 
			${
				props.status === 'successful'
					? 'ring-successful'
					: props.status === 'destructive'
						? 'ring-destructive'
						: 'ring-blue-500'
			}
			`}
			/>
		</div>
	);
}
