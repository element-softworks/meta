import { NewPasswordForm } from '@/components/auth/new-password-form';

export async function generateMetadata() {
	return {
		title: `New Password Meta Retail Manager`,
		description: 'Set a new password for your account Meta Retail Manager Retail Manager.',
		openGraph: {
			title: `New Password Meta Retail Manager`,
			description: 'Set a new password for your account Meta Retail Manager Retail Manager.',
		},
		twitter: {
			title: `New Password Meta Retail Manager`,
			description: 'Set a new password for your account Meta Retail Manager Retail Manager.',
		},
		alternates: {
			canonical: `${process.env.NEXT_PUBLIC_APP_URL}/auth/new-password`,
		},
	};
}

export default function NewPasswordPage() {
	return <NewPasswordForm />;
}
