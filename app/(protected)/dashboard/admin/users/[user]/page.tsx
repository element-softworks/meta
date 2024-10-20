import { ArchiveUserButton } from '@/components/auth/archive-user-button';
import { ResetPasswordAdminButton } from '@/components/auth/reset-password-admin-button';
import { SettingsForm } from '@/components/auth/settings-form';
import { Separator } from '@/components/ui/separator';
import { getUserById } from '@/data/user';
import { desc } from 'drizzle-orm';

export async function generateMetadata({ params }: { params: { user: string } }) {
	const user = await getUserById(params.user);
	return {
		title: `${user?.name ?? 'Users'} | Users | Admin | Dashboard | NextJS SaaS Boilerplate`,
		description: `${user?.name ?? 'Users'} account settings for NextJS SaaS Boilerplate.`,
		openGraph: {
			title: `${user?.name ?? 'Users'} | Users | Admin | Dashboard | NextJS SaaS Boilerplate`,
			description: `${user?.name ?? 'Users'} account settings for NextJS SaaS Boilerplate.`,
		},
		twitter: {
			title: `${user?.name ?? 'Users'} | Users | Admin | Dashboard | NextJS SaaS Boilerplate`,
			description: `${user?.name ?? 'Users'} account settings for NextJS SaaS Boilerplate.`,
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
				<ArchiveUserButton user={user} />
			</div>
		</main>
	);
}
