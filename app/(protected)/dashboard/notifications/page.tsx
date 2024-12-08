import { NotificationsContainer } from '@/components/infinite-scrolls/notifications-container';

export async function generateMetadata() {
	return {
		title: `Notifications | Dashboard | Meta`,
		description: 'Manage notifications for Meta.',
		openGraph: {
			title: `Notifications | Dashboard | Meta`,
			description: 'Manage notifications for Meta.',
		},
		twitter: {
			title: `Notifications | Dashboard | Meta`,
			description: 'Manage notifications for Meta.',
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
