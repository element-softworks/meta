import { SettingsForm } from '@/components/auth/settings-form';
import { currentUser } from '@/lib/auth';

export default async function SettingsPage() {
	const user = await currentUser();

	return (
		<main className="flex flex-col justify-center items-center ">
			<h1>users</h1>
		</main>
	);
}
