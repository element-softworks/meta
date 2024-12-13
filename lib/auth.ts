import { auth } from '@/auth';

export async function currentUser() {
	const session = await auth();

	return session?.user;
}

export async function currentRole() {
	const session = await auth();

	return session?.user?.role;
}

export async function checkPermissions({ admin }: { admin: boolean }) {
	const authUser = await currentUser();

	if (!authUser?.email) {
		return { error: 'You are not authenticated.' };
	}

	if (authUser?.role !== 'ADMIN' && admin) {
		return { error: 'You must be an administrator to perform this action.' };
	}

	return { success: 'Authorized', user: authUser };
}
