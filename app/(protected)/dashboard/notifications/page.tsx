import { NotificationsContainer } from '@/components/notifications-container';
import { Separator } from '@/components/ui/separator';

export async function generateMetadata() {
	return {
		title: `Notifications | Dashboard | NextJS SaaS Boilerplate`,
		description: 'Manage notifications for NextJS SaaS Boilerplate.',
		openGraph: {
			title: `Notifications | Dashboard | NextJS SaaS Boilerplate`,
			description: 'Manage notifications for NextJS SaaS Boilerplate.',
		},
		twitter: {
			title: `Notifications | Dashboard | NextJS SaaS Boilerplate`,
			description: 'Manage notifications for NextJS SaaS Boilerplate.',
		},
	};
}

export default async function NotificationsPage({ searchParams }: any) {
	return (
		<main className="flex flex-col  gap-4 max-w-2xl">
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
