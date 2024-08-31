import { Navbar } from '@/components/navbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col min-h-screen ">
			<Navbar />

			<div className="border-t border-border">
				<main className="">{children}</main>
			</div>
		</div>
	);
}
