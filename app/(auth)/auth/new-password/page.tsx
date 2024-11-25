import { NewPasswordForm } from '@/components/auth/new-password-form';

export async function generateMetadata() {
	return {
		title: `New Password | Meta`,
		description: 'Set a new password for your account on Meta.',
		openGraph: {
			title: `New Password | Meta`,
			description: 'Set a new password for your account on Meta.',
		},
		twitter: {
			title: `New Password | Meta`,
			description: 'Set a new password for your account on Meta.',
		},
		alternates: {
			canonical: `${process.env.NEXT_PUBLIC_APP_URL}/auth/new-password`,
		},
	};
}

export default function NewPasswordPage() {
	return <NewPasswordForm />;
}
