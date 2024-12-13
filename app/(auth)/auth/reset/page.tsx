import { ResetForm } from '@/components/auth/reset-form';

export async function generateMetadata() {
	return {
		title: `Reset Password Meta Retail Manager`,
		description: 'Reset your password Meta Retail Manager.',
		openGraph: {
			title: `Reset Password Meta Retail Manager`,
			description: 'Reset your password Meta Retail Manager.',
		},
		twitter: {
			title: `Reset Password Meta Retail Manager`,
			description: 'Reset your password Meta Retail Manager.',
		},
		alternates: {
			canonical: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset`,
		},
	};
}
export default function ResetPage() {
	return <ResetForm />;
}
