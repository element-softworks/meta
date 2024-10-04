'use client';

import {
	Duration,
	addDays,
	addSeconds,
	formatDuration,
	intervalToDuration,
	subSeconds,
} from 'date-fns';
import { Check, Gift, X } from 'lucide-react';
import { format } from 'path';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import Link from 'next/link';

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

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-10 w-full mt-4 lg:mt-16">
				{props.plans?.map((plan, index) => {
					return (
						<Card
							key={index}
							className={`${
								plan.popular && 'border-primary shadow-2xl lg:scale-105'
							} relative`}
						>
							{plan.popular ? (
								<Badge className="-top-3  uppercase hover:bg-primary absolute left-1/2 -translate-x-1/2">
									Popular
								</Badge>
							) : null}
							<CardHeader className="pt-8 pl-8">
								<CardTitle className="text-start">{plan.name}</CardTitle>
							</CardHeader>
							<CardContent className="p-4 md:p-8">
								{plan.price}
								<div className="mt-8 gap-2 flex flex-col">
									{plan.features.map((feature, index) => {
										return (
											<div
												key={index}
												className={`flex text-start items-center gap-2 ${
													feature.active
														? ''
														: 'text-muted-foreground line-through'
												}`}
											>
												{feature.active ? (
													<Check size={18} />
												) : (
													<X size={18} />
												)}
												<p>{feature.title}</p>
											</div>
										);
									})}
								</div>
							</CardContent>

							<CardFooter className="p-4 md:p-8 pt-0">
								<Link href="/auth/register" className="w-full">
									<Button className="w-full">Get started with {plan.name}</Button>
								</Link>
							</CardFooter>
						</Card>
					);
				})}
			</div>
		</section>
	);
}
