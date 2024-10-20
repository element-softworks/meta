import { NewVerificationForm } from '@/components/auth/new-verification-form';

export async function generateMetadata() {
	return {
		title: `New Verification | NextJS SaaS Boilerplate`,
		description: 'Verify your email address on NextJS SaaS Boilerplate.',
		openGraph: {
			title: `New Verification | NextJS SaaS Boilerplate`,
			description: 'Verify your email address on NextJS SaaS Boilerplate.',
		},
		twitter: {
			title: `New Verification | NextJS SaaS Boilerplate`,
			description: 'Verify your email address on NextJS SaaS Boilerplate.',
		},
		alternates: {
			canonical: `${process.env.NEXT_PUBLIC_APP_URL}/auth/new-verification`,
		},
	};
}

export default function NewVerificationPage() {
	return (
		<div>
			<NewVerificationForm />
		</div>
	);
}
