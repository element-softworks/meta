import { currentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
	const user = await currentUser();
	if (!user || user.role !== 'ADMIN') {
		return redirect('/dashboard');
	}

	return <>{children}</>;
}
