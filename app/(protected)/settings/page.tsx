'use client';
import { settings } from '@/actions/settings';
import { LogoutButton } from '@/components/auth/logout-button';
import { SettingsForm } from '@/components/auth/settings-form';
import { UserButton } from '@/components/auth/user-button';
import { Button } from '@/components/ui/button';
import { UserInfo } from '@/components/user-info';
import { useCurrentUser } from '@/hooks/use-current-user';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function SettingsPage() {
	const user = useCurrentUser();
	return (
		<main className="flex flex-col justify-center items-center h-screen">
			<LogoutButton>
				<Button>Sign Out</Button>
			</LogoutButton>

			<UserButton />

			<SettingsForm />
		</main>
	);
}
