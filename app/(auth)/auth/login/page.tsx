import { LoginForm } from '@/components/auth/login-form';

export async function generateMetadata() {
	return {
		title: `Login | Coaching Hours`,
		description: 'Login to your account on Coaching Hours.',
		openGraph: {
			title: `Login | Coaching Hours`,
			description: 'Login to your account on Coaching Hours.',
		},
		twitter: {
			title: `Login | Coaching Hours`,
			description: 'Login to your account on Coaching Hours.',
		},
		alternates: {
			canonical: `${process.env.NEXT_PUBLIC_APP_URL}/auth/login`,
		},
	};
}
export default function LoginPage() {
	return (
		<main>
			<LoginForm />
		</main>
	);
}
