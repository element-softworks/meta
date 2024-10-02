'use client';

import {
	Duration,
	addDays,
	addSeconds,
	formatDuration,
	intervalToDuration,
	subSeconds,
} from 'date-fns';
import { Gift } from 'lucide-react';
import { format } from 'path';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface PricingProps {
	title: string;
	caption: string;

	plans: {
		name: string;
		price: React.ReactNode;
		features: {
			title: string;
			active: boolean;
		}[];
		popular: boolean;
	}[];
}

export function Pricing(props: PricingProps) {
	return (
		<section className="flex flex-col md:items-center gap-4 md:gap-6">
			{!!props.caption ? (
				<p className="text-start md:text-center text-muted-foreground">{props.caption}</p>
			) : null}
			<h2 className="w-full text-start md:text-center font-semibold text-2xl md:text-4xl lg:text-5xl max-w-[22ch]">
				{props.title}
			</h2>
			<div className="flex gap-2">
				<Gift size={18} className="text-successful" />
				<p className="text-start text-sm">
					<span className="text-successful">20%</span> sale ends soon get it now!
				</p>
			</div>

			<div className="grid grid-cols-3 gap-6 w-full mt-8 md:mt-12">
				{props.plans?.map((plan, index) => {
					return (
						<Card
							key={index}
							className={`${plan.popular && 'border-primary shadow-2xl '} relative`}
						>
							{plan.popular ? (
								<Badge className="-top-3 absolute left-1/2 -translate-x-1/2">
									Popular
								</Badge>
							) : null}
							<CardHeader>
								<CardTitle className="text-start">{plan.name}</CardTitle>
							</CardHeader>
							<CardContent>
								<p>{plan.price}</p>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</section>
	);
}
