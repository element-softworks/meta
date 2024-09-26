import { NotificationsContainer } from '@/components/notifications-container';
import { Separator } from '@/components/ui/separator';

export default async function DashboardPage({ searchParams }: any) {
	return (
		<main className="flex flex-col  gap-4">
			<div className="flex gap-2 items-center">
				<div className="flex-1">
					<p className="text-xl font-bold">Manage notifications</p>
					<p className="text-muted-foreground text-sm">
						View and manage your notifications here
					</p>
				</div>
			</div>
			<Separator />

			<NotificationsContainer searchParams={searchParams} />
		</main>
	);
}
