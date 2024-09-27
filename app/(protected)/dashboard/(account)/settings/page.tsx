import { SettingsForm } from '@/components/auth/settings-form';
import { UserAvatarForm } from '@/components/auth/user-avatar-form';
import { Separator } from '@/components/ui/separator';

export default async function SettingsPage() {
	return (
		<main className="flex flex-col max-w-2xl gap-4">
			<div className="">
				<h1 className="text-xl font-bold">Account settings</h1>
				<p className="text-muted-foreground text-sm">Edit your account settings below</p>
			</div>

			<Separator />
			<div className="flex flex-col gap-2">
				<SettingsForm />
			</div>

			<UserAvatarForm />
		</main>
	);
}
