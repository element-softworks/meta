'use client';

import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

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

	const avatars = props.avatars?.slice?.(0, maxSize);
	const remaining = props.avatars?.length - maxSize;

	if (avatars?.length === 0) return null;

	return (
		<div className="flex relative">
			{avatars?.map?.((avatar, index) => {
				return (
					<Avatar
						key={index}
						className="size-7 relative"
						style={{
							left: `${-(index * (size / 2))}px`,
							zIndex: index,
							minHeight: `${size}px`,
							minWidth: `${size}px`,
						}}
					>
						{avatar?.src && (
							<Image
								className="object-cover border-[3px] border-white rounded-full"
								referrerPolicy="no-referrer"
								width={35}
								height={35}
								src={avatar.src}
								alt="user avatar"
							/>
						)}
						<AvatarFallback>{avatar.alt?.slice(0, 2)}</AvatarFallback>
					</Avatar>
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
					className="rounded-full bg-primary border-white border-[3px] text-primary-foreground text-center text-xs font-bold flex items-center justify-center relative"
				>
					{`+${remaining}`}
				</div>
			)}
		</div>
	);
}
