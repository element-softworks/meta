'use client';

import { MoveDown, MoveLeft, MoveUp } from 'lucide-react';

interface AnalyticsIconProps {
	size?: number;
	className: string;
	percentage: number;
}
export function AnalyticsIcon(props: AnalyticsIconProps) {
	const { size = 18 } = props;

	const icon =
		Number(props.percentage) === 0 ? (
			<MoveLeft size={size} className="text-neutral-500" />
		) : Number(props.percentage) > 0 ? (
			<MoveUp size={size} className="text-successful" />
		) : (
			<MoveDown size={size} className="text-destructive" />
		);

	return <div className={props.className}>{icon}</div>;
}
