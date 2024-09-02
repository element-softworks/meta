import { ArchiveUserForm } from '@/components/auth/archive-user-form';
import { ResetPasswordAdminButton } from '@/components/auth/reset-password-admin-button';
import { SettingsForm } from '@/components/auth/settings-form';
import { Separator } from '@/components/ui/separator';
import { getUserById } from '@/data/user';

export default async function AdminUserPage({ params }: { params: { user: string } }) {
	const user = await getUserById(params.user);

	return (
		<main className="flex flex-col max-w-4xl gap-6 h-full">
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
			<div className="flex flex-col gap-2">
				<SettingsForm adminMode={true} editingUser={user} />
			</div>
			{!user?.isOAuth ? (
				<>
					<Separator />
					<ResetPasswordAdminButton user={user} />
				</>
			) : null}

			<div className="mt-auto">
				<ArchiveUserForm user={user} />
			</div>
		</main>
	);
}
