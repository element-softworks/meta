import { LogoutButton } from '@/components/auth/logout-button';
import { SettingsForm } from '@/components/auth/settings-form';
import { UserButton } from '@/components/auth/user-button';
import { Button } from '@/components/ui/button';
import { currentUser } from '@/lib/auth';

export default async function SettingsPage() {
	const user = await currentUser();

	return (
		<main className="flex flex-col justify-center items-center h-screen">
			<LogoutButton>
				<Button>Sign Out</Button>
			</LogoutButton>

			<UserButton user={user} />

			<SettingsForm user={user} />
		</main>
	);
}
