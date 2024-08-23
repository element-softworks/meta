import { logout } from '@/actions/logout';
import { auth } from '@/auth';

export default async function SettingsPage() {
	const session = await auth();
	return (
		<main>
			{JSON.stringify(session)}
			<form
				action={async () => {
					'use server';
					await logout();
				}}
			>
				<button type="submit">Sign Out</button>
			</form>
		</main>
	);
}
