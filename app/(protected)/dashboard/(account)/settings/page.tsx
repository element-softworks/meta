import { SettingsForm } from '@/components/auth/settings-form';
import { UserAvatarForm } from '@/components/auth/user-avatar-form';
import { Separator } from '@/components/ui/separator';
import { currentUser } from '@/lib/auth';

export async function generateMetadata() {
	return {
		title: `Account settings | NextJS SaaS Boilerplate`,
		description: 'Manage your account settings on NextJS SaaS Boilerplate.',
		openGraph: {
			title: `Account settings | NextJS SaaS Boilerplate`,
			description: 'Manage your account settings on NextJS SaaS Boilerplate.',
		},
		twitter: {
			title: `Account settings | NextJS SaaS Boilerplate`,
			description: 'Manage your account settings on NextJS SaaS Boilerplate.',
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
