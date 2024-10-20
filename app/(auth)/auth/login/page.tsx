import { LoginForm } from '@/components/auth/login-form';

export async function generateMetadata() {
	return {
		title: `Login | NextJS SaaS Boilerplate`,
		description: 'Login to your account on NextJS SaaS Boilerplate.',
		openGraph: {
			title: `Login | NextJS SaaS Boilerplate`,
			description: 'Login to your account on NextJS SaaS Boilerplate.',
		},
		twitter: {
			title: `Login | NextJS SaaS Boilerplate`,
			description: 'Login to your account on NextJS SaaS Boilerplate.',
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
