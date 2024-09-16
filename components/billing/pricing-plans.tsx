'use client';
import { Button } from '@/components/ui/button';
import { useStripePricing } from '@/hooks/use-stripe-pricing';
import { useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { CheckCircle, CheckCircle2 } from 'lucide-react';

interface PricingPlansProps {
	stripeCustomerId: string;
}

interface PricingCardProps {
	type: 'year' | 'month';
	planName: string;
	price: string;
	description: string;
	features: string[];
	Button: React.ReactNode;
	className?: string;
}
function PricingCard(props: PricingCardProps) {
	return (
		<Card className={`w-full flex flex-col ${props.className}`}>
			<CardHeader>
				<p className="font-semibold text-muted-foreground">{props.planName}</p>

				<CardTitle>
					{props.price}/{props.type}
				</CardTitle>
				<CardDescription>{props.description}</CardDescription>
			</CardHeader>
			<CardContent className="my-6 flex flex-col gap-2">
				{props.features?.map((feature, index) => {
					return (
						<div key={index} className="flex gap-2 items-center">
							<CheckCircle2 className="text-successful" size={18} />
							<p>{feature}</p>
						</div>
					);
				})}
			</CardContent>
			<CardFooter className="flex justify-between mt-auto">{props.Button}</CardFooter>
		</Card>
	);
}

export default function PricingPlans(props: PricingPlansProps) {
	const [price, setPrice] = useState<'basic' | 'pro' | 'enterprise' | null>(null);

	const [isYearly, setIsYearly] = useState(false);

	useStripePricing({ enabled: !!price, price, stripeCustomerId: props.stripeCustomerId });

	return (
		<div className="text-start lg:text-center">
			<p className="text-xl md:text-3xl font-bold">Boilerplate pricing plans</p>
			<p className="text-muted-foreground">Select a plan to upgrade your account</p>

			<div className="flex gap-0 justify-start lg:justify-center mt-4">
				<Button
					onClick={() => setIsYearly(true)}
					className="rounded-tr-none rounded-br-none"
					variant={isYearly ? 'default' : 'secondary'}
				>
					Yearly
				</Button>
				<Button
					variant={!isYearly ? 'default' : 'secondary'}
					onClick={() => setIsYearly(false)}
					className="rounded-tl-none rounded-bl-none"
				>
					Monthly
				</Button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
				<PricingCard
					type={isYearly ? 'year' : 'month'}
					planName="Basic"
					price={isYearly ? '£119.88' : '£9.99'}
					description="Essential features you need to get started"
					features={['Feature 1', 'Feature 2', 'Feature 3']}
					Button={
						<Button
							className="w-full"
							onClick={() => {
								setPrice('basic');
							}}
						>
							Get started with Basic
						</Button>
					}
				/>
				<PricingCard
					className="lg:scale-105 shadow-md border-primary"
					type={isYearly ? 'year' : 'month'}
					planName="Pro"
					price={isYearly ? '£299.88' : '£24.99'}
					description="Perfect for owners of small & medium businesses"
					features={['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4']}
					Button={
						<Button
							className="w-full"
							onClick={() => {
								setPrice('pro');
							}}
						>
							Get started with pro
						</Button>
					}
				/>

				<PricingCard
					type={isYearly ? 'year' : 'month'}
					planName="Enterprise"
					price={isYearly ? '£599.88' : '£49.99'}
					description="Dedicated support and infrastructure to fit your needs"
					features={['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Feature 5']}
					Button={
						<Button
							className="w-full"
							onClick={() => {
								setPrice('enterprise');
							}}
						>
							Get started with enterprise
						</Button>
					}
				/>
			</div>
		</div>
	);
}
