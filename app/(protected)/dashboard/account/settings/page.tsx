import { SettingsForm } from '@/components/auth/settings-form';
import { currentUser } from '@/lib/auth';
import { Separator } from '@/components/ui/separator';
import { ChangeEmailForm } from '@/components/auth/change-email-form';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';

export default async function SettingsPage() {
	const user = await currentUser();

	return (
		<main className="flex flex-col max-w-2xl gap-6">
			<div className="">
				<p className="text-xl font-bold">Account settings</p>
				<p className="text-muted-foreground text-sm">Edit your account settings below.</p>
			</div>

			<Separator />
			<div className="flex flex-col gap-2">
				<ChangeEmailForm user={user} />

				<SettingsForm user={user} />
			</div>
			{!user?.isOAuth ? <Separator /> : null}

			<ResetPasswordForm user={user} />
		</main>
	);
}
