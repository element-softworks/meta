import { ChangeEmailForm } from '@/components/auth/change-email-form';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { SettingsForm } from '@/components/auth/settings-form';
import { UserAvatarForm } from '@/components/auth/user-avatar-form';
import { Separator } from '@/components/ui/separator';

export default async function SettingsPage() {
	return (
		<main className="flex flex-col max-w-2xl gap-6">
			<div className="">
				<p className="text-xl font-bold">Account settings</p>
				<p className="text-muted-foreground text-sm">Edit your account settings below</p>
			</div>

			<Separator />
			<div className="flex flex-col gap-2">
				<ChangeEmailForm />

				<SettingsForm />
			</div>

			<UserAvatarForm />

			<ResetPasswordForm />
		</main>
	);
}
