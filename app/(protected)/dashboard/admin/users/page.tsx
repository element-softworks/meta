import UsersTableContainer from '@/components/tables/users-table-container';
import { Separator } from '@/components/ui/separator';

export default async function SettingsPage({ searchParams }: { searchParams: any }) {
	return (
		<main className="flex flex-col max-w-4xl gap-6">
			<div className="">
				<p className="text-xl font-bold">Users</p>
				<p className="text-muted-foreground text-sm">View and manage platform users here</p>
			</div>

			<Separator />

			<UsersTableContainer searchParams={searchParams} />
		</main>
	);
}
