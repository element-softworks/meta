import { LoginForm } from '@/components/auth/login-form';
import { RegisterForm } from '@/components/auth/register-form';
import { getConciergeTokenByToken } from '@/data/concierge-token';

export async function generateMetadata() {
	return {
		title: `Register | Coaching Hours`,
		description: 'Register for an account on Coaching Hours.',
		openGraph: {
			title: `Register | Coaching Hours`,
			description: 'Register for an account on Coaching Hours.',
		},
		twitter: {
			title: `Register | Coaching Hours`,
			description: 'Register for an account on Coaching Hours.',
		},
		alternates: {
			canonical: `${process.env.NEXT_PUBLIC_APP_URL}/auth/register`,
		},
	};
}

export default async function RegisterPage({ searchParams }: { searchParams?: { token: string } }) {
	const token = await getConciergeTokenByToken(searchParams?.token ?? '');
	return (
		<main>
			<RegisterForm token={token} />
		</main>
	);
}
