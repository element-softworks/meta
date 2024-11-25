import { LoginForm } from '@/components/auth/login-form';

export async function generateMetadata() {
	return {
		title: `Login | Meta`,
		description: 'Login to your account on Meta.',
		openGraph: {
			title: `Login | Meta`,
			description: 'Login to your account on Meta.',
		},
		twitter: {
			title: `Login | Meta`,
			description: 'Login to your account on Meta.',
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
