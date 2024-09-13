import { Separator } from '@/components/ui/separator';

export default async function DashboardPage({ searchParams }: any) {
	return (
		<main className="flex flex-col max-w-3xl gap-6">
			<div className="flex gap-2 items-center">
				<div className="flex-1">
					<p className="text-xl font-bold">Payment success</p>
					<p className="text-muted-foreground text-sm">Your payment was successful</p>
				</div>
			</div>
			<Separator />
		</main>
	);
}
