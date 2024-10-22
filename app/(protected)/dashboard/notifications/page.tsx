import { NotificationsContainer } from '@/components/infinite-scrolls/notifications-container';

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
			<NotificationsContainer searchParams={searchParams} />
		</main>
	);
}
