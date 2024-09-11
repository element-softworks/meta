import { getUserNotifications } from '@/actions/get-user-notifications';
import { Separator } from '@/components/ui/separator';
import { currentUser } from '@/lib/auth';

export default async function DashboardPage({ searchParams }: any) {
	const user = await currentUser();
	const notifications = await getUserNotifications(user?.id ?? '');
	return (
		<main className="flex flex-col max-w-4xl gap-6">
			<div className="flex gap-2 items-center">
				<div className="flex-1">
					<p className="text-xl font-bold">Manage notifications</p>
					<p className="text-muted-foreground text-sm">
						View and manage your notifications here
					</p>
				</div>
			</div>
			<Separator />

			{notifications?.map((notification, index) => {
				return (
					<div key={index} className="flex gap-2 items-center">
						<div className="flex-1">
							<p className="text-lg font-bold">{notification.id}</p>
							<p className="text-muted-foreground text-sm">{notification.message}</p>
						</div>
						<div className="flex gap-2">
							<button className="btn btn-sm btn-primary">Mark as read</button>
							<button className="btn btn-sm btn-secondary">Delete</button>
						</div>
					</div>
				);
			})}
		</main>
	);
}
