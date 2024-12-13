import { TwoFactorForm } from '@/components/auth/2fa-form';
import { ArchiveUserButton } from '@/components/auth/archive-user-button';
import { FormInput } from '@/components/auth/form-input';
import { ResetPasswordAdminButton } from '@/components/auth/reset-password-admin-button';
import { SettingsForm } from '@/components/auth/settings-form';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { getUserById } from '@/data/user';

export async function generateMetadata({ params }: { params: { user: string } }) {
	const user = await getUserById(params.user);
	return {
		title: `${user?.name ?? 'Users'} | Users | Admin | Dashboard Meta Retail Manager`,
		description: `${user?.name ?? 'Users'} account settings for Meta.`,
		openGraph: {
			title: `${user?.name ?? 'Users'} | Users | Admin | Dashboard Meta Retail Manager`,
			description: `${user?.name ?? 'Users'} account settings for Meta.`,
		},
		twitter: {
			title: `${user?.name ?? 'Users'} | Users | Admin | Dashboard Meta Retail Manager`,
			description: `${user?.name ?? 'Users'} account settings for Meta.`,
		},
	};
}

export default async function AdminUserPage({ params }: { params: { user: string } }) {
	const user = await getUserById(params.user);

	return (
		<main className="flex flex-col  gap-4 h-full max-w-2xl">
			<div className="">
				<p className="text-xl font-bold">
					{user?.name ?? 'Users'}
					{"'"}s account settings
				</p>
				<p className="text-muted-foreground text-sm">
					View and manage {user?.name}
					{"'"}s account settings here
				</p>
			</div>

			<Separator />

			<div className="">
				<p className="text-sm mb-2 font-medium">Email</p>
				<Input value={user?.email} disabled={true} />
			</div>
			<div className="flex flex-col gap-2">
				<SettingsForm adminMode={true} editingUser={user} />
			</div>

			{!user?.isOAuth ? (
				<>
					<Separator />
					<TwoFactorForm adminMode={true} editingUser={user} />
				</>
			) : null}

			{!user?.isOAuth ? (
				<>
					<Separator />
					<ResetPasswordAdminButton user={user} />
				</>
			) : null}

			<div className="mt-auto">
				<ArchiveUserButton user={user} />
			</div>
		</main>
	);
}
