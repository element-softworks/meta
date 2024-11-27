import { DashboardLayout } from '@/components/layouts';
import { currentUser } from '@/lib/auth';

export async function generateMetadata() {
	return {
		title: `Dashboard | Meta`,
		description: 'Dashboard for Meta.',
		openGraph: {
			title: `Dashboard | Meta`,
			description: 'Dashboard for Meta.',
		},
		twitter: {
			title: `Dashboard | Meta`,
			description: 'Dashboard for Meta.',
		},
	};
}

export default async function DashboardPage() {
	const userResponse = await currentUser();

	return (
		<DashboardLayout>
			<main className="flex flex-col  gap-4 h-full">
				<section className="xl:ml-[10%] xl:mt-[6%]"></section>
			</main>
		</DashboardLayout>
	);
}
