import { ResetForm } from '@/components/auth/reset-form';

export async function generateMetadata() {
	return {
		title: `Reset Password | Coaching Hours`,
		description: 'Reset your password on Coaching Hours.',
		openGraph: {
			title: `Reset Password | Coaching Hours`,
			description: 'Reset your password on Coaching Hours.',
		},
		twitter: {
			title: `Reset Password | Coaching Hours`,
			description: 'Reset your password on Coaching Hours.',
		},
		alternates: {
			canonical: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset`,
		},
	};
}
export default function ResetPage() {
	return <ResetForm />;
}
