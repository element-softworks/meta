import { UsersTable } from '@/components/tables/users-table';
import { getAllUsers } from '@/data/get-all-users';
import { Separator } from '@/components/ui/separator';

export default async function SettingsPage({ searchParams }: { searchParams: any }) {
	const data = await getAllUsers({
		pageNum: Number(searchParams?.['users-pageNum'] ?? 1),
		perPage: Number(searchParams?.['users-perPage'] ?? 100),
	});

	console.log(data.totalPages, 'total pages');
	return (
		<main className="flex flex-col max-w-4xl gap-6">
			<div className="">
				<p className="text-xl font-bold">Users</p>
				<p className="text-muted-foreground text-sm">View and manage platform users here</p>
			</div>

			<Separator />

			<UsersTable users={data.users ?? []} totalPages={data?.totalPages} />
		</main>
	);
}
