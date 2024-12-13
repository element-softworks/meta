import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function MenuItem({
	icon,
	title,
	action,
	isActive = null,
}: {
	icon?: React.ReactNode;
	title?: string;
	action?: () => void;
	isActive?: (() => boolean) | null;
}) {
	return (
		<TooltipProvider>
			<Tooltip delayDuration={0}>
				<TooltipTrigger>
					<button
						className={`flex items-center justify-center
			bg-transparent border-0 rounded-md text-foreground cursor-pointer size-6 hover:bg-primary-foreground hover:text-primary-background
			${isActive && isActive() ? '!text-foreground !bg-primary' : ''}
			`}
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							action?.();
						}}
						title={title}
					>
						<div className="p-1">{icon}</div>
					</button>
				</TooltipTrigger>
				<TooltipContent>{title}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
