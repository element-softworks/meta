import { DocsSidebar } from '@/components/layout/docs-sidebar';

export default async function DocsLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col min-h-screen ">
			<div className="flex flex-1">
				<DocsSidebar />

				<div className="w-full overflow-hidden flex-1 flex flex-col">
					<main className="w-full p-4  overflow-hidden flex-1 max-w-4xl">{children}</main>
				</div>
			</div>
		</div>
	);
}
