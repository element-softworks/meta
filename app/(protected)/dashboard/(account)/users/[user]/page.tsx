import { SettingsForm } from '@/components/auth/settings-form';
import { UserAvatarForm } from '@/components/auth/user-avatar-form';
import { Separator } from '@/components/ui/separator';
import { currentUser } from '@/lib/auth';

export async function generateMetadata() {
	return {
		title: `Account settings Meta Retail Manager`,
		description: 'Manage your account settings Meta Retail Manager.',
		openGraph: {
			title: `Account settings Meta Retail Manager`,
			description: 'Manage your account settings Meta Retail Manager.',
		},
		twitter: {
			title: `Account settings Meta Retail Manager`,
			description: 'Manage your account settings Meta Retail Manager.',
		},
	};
}

export default async function SettingsPage() {
	const user = await currentUser();
	return (
		<main className="flex flex-col max-w-2xl gap-4">
			<div className="">
				<h1 className="text-xl font-bold">Account settings</h1>
				<p className="text-muted-foreground text-sm">
					Edit your account settings below for {user?.email}
				</p>
			</div>

			<Separator />
			<div className="flex flex-col gap-2">
				<SettingsForm />
			</div>

			<UserAvatarForm />
		</main>
	);
}
