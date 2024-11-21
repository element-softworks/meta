import { coachApplicationStart } from '@/actions/booking-system/coach-application-start';
import { getSelfApplication } from '@/actions/booking-system/get-self-application';
import { CoachSetupForm } from '@/components/auth/coach/setup/coach-setup-form';
import { RegisterForm } from '@/components/auth/register-form';
import { getConciergeTokenByToken } from '@/data/concierge-token';
import { cookies, headers } from 'next/headers';

export async function generateMetadata() {
	return {
		title: `Coach Setup | Coaching Hours`,
		description: 'Coach Setup for an account on Coaching Hours.',
		openGraph: {
			title: `Coach Setup | Coaching Hours`,
			description: 'Coach Setup for an account on Coaching Hours.',
		},
		twitter: {
			title: `Coach Setup | Coaching Hours`,
			description: 'Coach Setup for an account on Coaching Hours.',
		},
		alternates: {
			canonical: `${process.env.NEXT_PUBLIC_APP_URL}/auth/coach-setup`,
		},
	};
}

export default async function CoachSetupPage({
	searchParams,
}: {
	searchParams?: { token: string };
}) {
	let sessionID = null;
	const applicationId = await cookies().get('coachApplicationId');

	const currentSession = await getSelfApplication();

	if (!currentSession.data || !applicationId?.value?.length) {
		const newAppData = await coachApplicationStart();
		sessionID = newAppData?.data?.id ?? '';
	} else {
		sessionID = currentSession.data.id;
	}

	// read the custom x-url header

	const veriffSession = await cookies().get('veriffSession');
	const sessionCookie = await cookies().get('coachApplicationId');

	return (
		<main>
			<CoachSetupForm
				sessionId={sessionID}
				hasCookie={!!sessionCookie?.value}
				searchParams={searchParams}
				veriffSession={veriffSession?.value}
				session={currentSession?.data}
			/>
		</main>
	);
}
