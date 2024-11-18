import { NotificationsContainer } from '@/components/infinite-scrolls/notifications-container';

export async function generateMetadata() {
	return {
		title: `Notifications | Dashboard | Coaching Hours`,
		description: 'Manage notifications for Coaching Hours.',
		openGraph: {
			title: `Notifications | Dashboard | Coaching Hours`,
			description: 'Manage notifications for Coaching Hours.',
		},
		twitter: {
			title: `Notifications | Dashboard | Coaching Hours`,
			description: 'Manage notifications for Coaching Hours.',
		},
	};
}

export default async function NotificationsPage({ searchParams }: any) {
	return (
		<main className="flex flex-col  gap-4 max-w-2xl">
			<NotificationsContainer searchParams={searchParams} />
		</main>
	);
}
