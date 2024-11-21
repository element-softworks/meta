import { CoachApplicationStatusCard } from '@/components/coach/coach-application-status-card';
import { CoachCard } from '@/components/coach/coach-card';
import { Badge } from '@/components/ui/badge';
import { db } from '@/db/drizzle/db';
import { coachApplication } from '@/db/drizzle/schema';
import { currentUser } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { Luggage, MessageCircle } from 'lucide-react';

export async function generateMetadata() {
	return {
		title: `Dashboard | Coaching Hours`,
		description: 'Dashboard for Coaching Hours.',
		openGraph: {
			title: `Dashboard | Coaching Hours`,
			description: 'Dashboard for Coaching Hours.',
		},
		twitter: {
			title: `Dashboard | Coaching Hours`,
			description: 'Dashboard for Coaching Hours.',
		},
	};
}

export default async function DashboardPage() {
	const userResponse = await currentUser();
	const [coachApplicationResponse] = await db
		.select()
		.from(coachApplication)
		.where(eq(coachApplication.coachId, userResponse?.coachId ?? ''));

	return (
		<main className="flex flex-col  gap-4 h-full">
			<section className="xl:ml-[10%] xl:mt-[6%]">
				<CoachApplicationStatusCard application={coachApplicationResponse} />
			</section>
		</main>
	);
}
