'use client';

import { useAdminRoute } from '@/hooks/use-admin-route';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	useAdminRoute();

	return <>{children}</>;
}
