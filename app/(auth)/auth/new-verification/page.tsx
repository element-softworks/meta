import { NewVerificationForm } from '@/components/auth/new-verification-form';

export async function generateMetadata() {
	return {
		title: `New Verification | Coaching Hours`,
		description: 'Verify your email address on Coaching Hours.',
		openGraph: {
			title: `New Verification | Coaching Hours`,
			description: 'Verify your email address on Coaching Hours.',
		},
		twitter: {
			title: `New Verification | Coaching Hours`,
			description: 'Verify your email address on Coaching Hours.',
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
