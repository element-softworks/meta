'use client';

import Image from 'next/image';

interface AvatarGroupProps {
	avatars: {
		src: string;
		alt: string;
	}[];
	size?: number;
	maxSize?: number;
}
export function AvatarGroup(props: AvatarGroupProps) {
	const { size = 35, maxSize = 5 } = props;

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
							height: `${size}px`,
							width: `${size}px`,
						}}
						width={100}
						height={100}
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
