import { TwoFactorForm } from '@/components/auth/2fa-form';
import { ChangeEmailForm } from '@/components/auth/change-email-form';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { GeneralLayout } from '@/components/layouts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { getAccountByUserId } from '@/data/account';
import { currentUser } from '@/lib/auth';
import { AlertCircle, Info } from 'lucide-react';

export async function generateMetadata() {
	return {
		title: `Account security | Meta`,
		description: 'Manage your account security settings on Meta.',
		openGraph: {
			title: `Account security | Meta`,
			description: 'Manage your account security settings on Meta.',
		},
		twitter: {
			title: `Account security | Meta`,
			description: 'Manage your account security settings on Meta.',
		},
	};
}

export default async function SecurityPage() {
	const user = await currentUser();
	const account = await getAccountByUserId(user?.id ?? '');
	return (
		<GeneralLayout
			crumbs={[
				{
					active: true,
					text: `Security`,
					default: 'Security',
				},
			]}
		>
			<main className="flex flex-col max-w-2xl gap-4">
				<div className="">
					<h1 className="text-xl font-bold">Account security</h1>
					<p className="text-muted-foreground text-sm">
						Edit your account security settings below
					</p>
				</div>

				<Separator />

				{user?.isOAuth ? (
					<Alert className="mb-6">
						<Info className="h-4 w-4" />
						<AlertTitle>Note</AlertTitle>
						<AlertDescription>
							As you{"'"}ve signed in with {account?.provider} there{"'"}s no option
							to edit your email, password, or 2FA. Please login to{' '}
							{account?.provider} to manage this
						</AlertDescription>
					</Alert>
				) : null}

				<div className="flex flex-col gap-2">
					<ChangeEmailForm />
				</div>
				<TwoFactorForm />

				<ResetPasswordForm />
			</main>
		</GeneralLayout>
	);
}
