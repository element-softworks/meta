import { NewPasswordForm } from '@/components/auth/new-password-form';

export async function generateMetadata() {
	return {
		title: `New Password | NextJS SaaS Boilerplate`,
		description: 'Set a new password for your account on NextJS SaaS Boilerplate.',
		openGraph: {
			title: `New Password | NextJS SaaS Boilerplate`,
			description: 'Set a new password for your account on NextJS SaaS Boilerplate.',
		},
		twitter: {
			title: `New Password | NextJS SaaS Boilerplate`,
			description: 'Set a new password for your account on NextJS SaaS Boilerplate.',
		},
		alternates: {
			canonical: `${process.env.NEXT_PUBLIC_APP_URL}/auth/new-password`,
		},
	};
}

export default function NewPasswordPage() {
	return <NewPasswordForm />;
}
