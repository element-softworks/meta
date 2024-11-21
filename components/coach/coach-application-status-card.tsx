'use client';

import { FaComments, FaSuitcase } from 'react-icons/fa';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { CoachApplication } from '@/db/drizzle/schema/booking-system/coachApplication';
import { Luggage, MessageCircle } from 'lucide-react';
import { CoachCard } from './coach-card';

interface CoachApplicationStatusCardProps {
	application: CoachApplication;
}

export function CoachApplicationStatusCard(props: CoachApplicationStatusCardProps) {
	let statusText = '';
	let badgeText = '';

	if (props.application?.status === 'PENDING') {
		badgeText = 'application pending';
		statusText =
			"We've received your application and will update you via email the outcome, usually within 24 hours.";
	} else if (props.application?.status === 'REJECTED') {
		badgeText = 'application rejected';
		statusText =
			'Your application was rejected, please see your email for the reason, contact us if you need more information.';
	} else {
		badgeText = 'application approved';
		statusText = 'You have been approved, once our system is ready, you can start coaching!';
	}

	return (
		<>
			<h1 className="font-display text-3xl lg:text-4xl font-medium lowercase">
				Good morning, {props.application?.firstName}
			</h1>
			<p className="text-base lg:text-lg mt-2">{statusText}</p>
			<CoachCard
				title={`${props.application?.firstName} ${props.application?.lastName}`}
				image={props.application?.avatar ?? ''}
				icon={
					<img
						className="object-cover rounded-full size-[23px]"
						loading="lazy"
						width="23"
						height="23"
						srcSet={`https://flagcdn.com/w40/${props.application.location?.toLowerCase()}.png 2x`}
						src={`https://flagcdn.com/w20/${props.application.location?.toLowerCase()}.png`}
						alt={`country flag`}
					/>
				}
			>
				<Badge className="w-fit" variant="background">
					{badgeText}
				</Badge>

				<div className="flex flex-row gap-2 items-center">
					<Luggage size={20} />
					<p className="text-muted-foreground ">
						{props.application?.yearsExperience ?? 0} years experience in coaching
					</p>
				</div>

				<div className="flex flex-row gap-2 items-center">
					<MessageCircle size={20} />
					<p className="text-muted-foreground ">
						{props.application?.hoursExperience ?? ''} hours logged
					</p>
				</div>

				<div>
					<div className="flex flex-wrap gap-4 md:gap-10 lg:gap-8  bg-secondary rounded-3xl p-4 px-8 justify-between">
						<div>
							<p className="text-muted-foreground ">per session</p>
							<p className="text-foreground font-display font-semibold">$79</p>
						</div>
						<div>
							<p className="text-muted-foreground ">experience</p>
							<p className="text-foreground font-display font-semibold">
								{props.application?.yearsExperience} years
							</p>
						</div>
						<div>
							<p className="text-muted-foreground ">avg. rating</p>
							<p className="text-foreground font-display font-semibold">TBC</p>
						</div>
					</div>
				</div>
			</CoachCard>
		</>
	);
}
