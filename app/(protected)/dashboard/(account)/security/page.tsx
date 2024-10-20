import { ChangeEmailForm } from '@/components/auth/change-email-form';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { Separator } from '@/components/ui/separator';

export async function generateMetadata() {
	return {
		title: `Account security | NextJS SaaS Boilerplate`,
		description: 'Manage your account security settings on NextJS SaaS Boilerplate.',
		openGraph: {
			title: `Account security | NextJS SaaS Boilerplate`,
			description: 'Manage your account security settings on NextJS SaaS Boilerplate.',
		},
		twitter: {
			title: `Account security | NextJS SaaS Boilerplate`,
			description: 'Manage your account security settings on NextJS SaaS Boilerplate.',
		},
	};
}

export default async function SecurityPage() {
	return (
		<main className="flex flex-col max-w-2xl gap-4">
			<div className="">
				<h1 className="text-xl font-bold">Account security</h1>
				<p className="text-muted-foreground text-sm">
					Edit your account security settings below
				</p>
			</div>

			<Separator />
			<div className="flex flex-col gap-2">
				<ChangeEmailForm />
			</div>

			<ResetPasswordForm />
		</main>
	);
}
