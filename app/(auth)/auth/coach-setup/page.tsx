import { CoachSetupForm } from '@/components/auth/coach/setup/coach-setup-form';
import { RegisterForm } from '@/components/auth/register-form';
import { getConciergeTokenByToken } from '@/data/concierge-token';

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
	const token = await getConciergeTokenByToken(searchParams?.token ?? '');
	return (
		<main>
			<CoachSetupForm searchParams={searchParams} />
		</main>
	);
}
