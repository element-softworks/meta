import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col min-h-screen ">
			<Navbar />

			<div className="border-t border-border flex ">
				<Sidebar />
				<main className="items-center justify-center flex w-full bg-muted">{children}</main>
			</div>
		</div>
	);
}
