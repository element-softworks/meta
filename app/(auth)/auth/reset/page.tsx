import { ResetForm } from '@/components/auth/reset-form';

export async function generateMetadata() {
	return {
		title: `Reset Password | NextJS SaaS Boilerplate`,
		description: 'Reset your password on NextJS SaaS Boilerplate.',
		openGraph: {
			title: `Reset Password | NextJS SaaS Boilerplate`,
			description: 'Reset your password on NextJS SaaS Boilerplate.',
		},
		twitter: {
			title: `Reset Password | NextJS SaaS Boilerplate`,
			description: 'Reset your password on NextJS SaaS Boilerplate.',
		},
		alternates: {
			canonical: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset`,
		},
	};
}
export default function ResetPage() {
	return <ResetForm />;
}
