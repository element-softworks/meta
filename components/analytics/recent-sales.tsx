'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomerInvoice } from '@/db/drizzle/schema/customerInvoice';
import { User } from '@/db/drizzle/schema/user';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Link from 'next/link';

interface RecentSales {
	title: string;
	description: string;
	sales: {
		invoice: CustomerInvoice;
		user: User | null;
	}[];
}

export function RecentSales(props: RecentSales) {
	return (
		<Card className="h-[390px] overflow-hidden">
			<CardHeader className="flex flex-col items-stretch space-y-0 p-0 sm:flex-row">
				<div className="flex flex-1 flex-col lg:flex-row justify-center lg:justify-start lg:items-start gap-1 lg:gap-4 px-4 py-4 sm:py-4">
					<div className="flex-1">
						<CardTitle>{props.title}</CardTitle>
						<CardDescription>{props.description}</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent className="px-2 sm:px-4 h-full overflow-auto">
				{props.sales.map((sale) => {
					if (!sale?.user) return null;

					return (
						<div
							key={sale.invoice.id}
							className="flex items-center justify-between py-2"
						>
							<Link
								className="flex items-center gap-2 hover:opacity-70 transition-all"
								href={`/dashboard/admin/users/${sale.user?.id}`}
							>
								<Avatar className="size-7 relative">
									{!!sale.user?.image && (
										<AvatarImage
											width={35}
											height={35}
											src={sale.user?.image}
											alt={sale.user?.name ?? ''}
										/>
									)}
									<AvatarFallback>{sale?.user?.name?.slice(0, 2)}</AvatarFallback>
								</Avatar>
								<div>
									<div className="text-sm font-semibold ">
										{sale.user?.name ?? 'Unknown'}
									</div>
									<div className="text-xs text-muted-foreground">
										{sale.invoice.createdAt.toLocaleDateString()}
									</div>
								</div>
							</Link>
							<div className="text-sm font-semibold ">
								£{sale?.invoice?.total / 100}
							</div>
						</div>
					);
				})}
			</CardContent>
		</Card>
	);
}
