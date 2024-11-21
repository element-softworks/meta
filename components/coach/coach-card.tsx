'use client';

import { FaComments, FaSuitcase } from 'react-icons/fa';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { CoachApplication } from '@/db/drizzle/schema/booking-system/coachApplication';
import { Luggage, MessageCircle } from 'lucide-react';

interface CoachCardProps {
	image: string;
	icon: React.ReactNode;
	title: string;
	children: React.ReactNode;
}

export function CoachCard(props: CoachCardProps) {
	return (
		<Card className="p-4 lg:pr-8 w-fit mt-8 relative">
			<div className="flex flex-col gap-10 lg:flex-row grid-cols-1 ">
				<div className="aspect-square">
					<img
						src={props.image}
						alt="coach image"
						className="object-cover rounded-2xl h-full min-w-[300px] w-full aspect-square max-h-[300px]"
					/>
				</div>

				<div className="flex flex-col gap-4 h-full justify-between">
					<div className="flex gap-4 lg:mt-4 items-center">
						<p className="flex-1 font-display text-xl lg:text-2xl  font-semibold lowercase">
							{props.title}
						</p>

						{props.icon}
					</div>

					{props.children}
				</div>
			</div>
		</Card>
	);
}
