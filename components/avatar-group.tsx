'use client';

import Image from 'next/image';

interface AvatarGroupProps {
	avatars:
		| {
				src: string;
				alt: string;
				link?: string;
		  }[]
		| undefined;
	size?: number;
	maxSize?: number;
}
export function AvatarGroup(props: AvatarGroupProps) {
	const { size = 35, maxSize = 5 } = props;

	if (!props.avatars?.length) return null;

	const avatars = props.avatars.slice(0, maxSize);
	const remaining = props.avatars.length - maxSize;

	return (
		<div className="flex relative">
			{avatars.map((avatar, index) => {
				return (
					<Image
						key={index}
						className="rounded-full top-1/2 relative border-2 border-white"
						style={{
							left: `${-(index * (size / 2))}px`,
							zIndex: index,
						}}
						width={size}
						height={size}
						src={avatar.src}
						alt={avatar.alt}
					/>
				);
			})}

			{remaining > 0 && (
				<div
					style={{
						left: `${-(avatars.length * (size / 2))}px`,
						zIndex: avatars.length,
						minWidth: `${size}px`,
						minHeight: `${size}px`,
					}}
					className="rounded-full bg-primary border-white border-2 text-primary-foreground text-center text-xs font-bold flex items-center justify-center relative"
				>
					{`+${remaining}`}
				</div>
			)}
		</div>
	);
}
