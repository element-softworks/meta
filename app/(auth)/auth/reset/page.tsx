import { ResetForm } from '@/components/auth/reset-form';

export async function generateMetadata() {
	return {
		title: `Reset Password | Meta`,
		description: 'Reset your password on Meta.',
		openGraph: {
			title: `Reset Password | Meta`,
			description: 'Reset your password on Meta.',
		},
		twitter: {
			title: `Reset Password | Meta`,
			description: 'Reset your password on Meta.',
		},
		alternates: {
			canonical: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset`,
		},
	};
}
export default function ResetPage() {
	return <ResetForm />;
}
