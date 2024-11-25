import { NewVerificationForm } from '@/components/auth/new-verification-form';

export async function generateMetadata() {
	return {
		title: `New Verification | Meta`,
		description: 'Verify your email address on Meta.',
		openGraph: {
			title: `New Verification | Meta`,
			description: 'Verify your email address on Meta.',
		},
		twitter: {
			title: `New Verification | Meta`,
			description: 'Verify your email address on Meta.',
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
