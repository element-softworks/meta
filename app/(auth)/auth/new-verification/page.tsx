import { NewVerificationForm } from '@/components/auth/new-verification-form';

export async function generateMetadata() {
	return {
		title: `New VerificatiMeta Retail Manager Retail Manager`,
		description: 'Verify your email address Meta Retail Manager Retail Manager.',
		openGraph: {
			title: `New VerificatiMeta Retail Manager Retail Manager`,
			description: 'Verify your email address Meta Retail Manager Retail Manager.',
		},
		twitter: {
			title: `New VerificatiMeta Retail Manager Retail Manager`,
			description: 'Verify your email address Meta Retail Manager Retail Manager.',
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
