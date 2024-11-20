import { NewPasswordForm } from '@/components/auth/new-password-form';

export async function generateMetadata() {
	return {
		title: `New Password | Coaching Hours`,
		description: 'Set a new password for your account on Coaching Hours.',
		openGraph: {
			title: `New Password | Coaching Hours`,
			description: 'Set a new password for your account on Coaching Hours.',
		},
		twitter: {
			title: `New Password | Coaching Hours`,
			description: 'Set a new password for your account on Coaching Hours.',
		},
		alternates: {
			canonical: `${process.env.NEXT_PUBLIC_APP_URL}/auth/new-password`,
		},
	};
}

export default function NewPasswordPage() {
	return <NewPasswordForm />;
}
