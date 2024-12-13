import { LoginForm } from '@/components/auth/login-form';

export async function generateMetadata() {
	return {
		title: `Login Meta Retail Manager`,
		description: 'Login to your account Meta Retail Manager Retail Manager.',
		openGraph: {
			title: `Login Meta Retail Manager`,
			description: 'Login to your account Meta Retail Manager Retail Manager.',
		},
		twitter: {
			title: `Login Meta Retail Manager`,
			description: 'Login to your account Meta Retail Manager Retail Manager.',
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
