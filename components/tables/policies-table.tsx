'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../general/data-table';
import { Question } from '@/db/drizzle/schema/question';
import { CreatePolicyAction } from '../policies/create-policy-action';
import { PoliciesResponse } from '@/actions/policy/get-policies';
import countries from '@/countries.json';
import { Avatar } from '../ui/avatar';
import { AvatarGroup } from '../general/avatar-group';
import Image from 'next/image';
import { formatDistance } from 'date-fns';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface PoliciesTableProps {
	policies: PoliciesResponse['policies'];
	totalPages: number | undefined;
	totalPolicies: number;
	isLoading: boolean;
}

export function PoliciesTable(props: PoliciesTableProps) {
	const { isLoading = false } = props;
	const columns: ColumnDef<PoliciesResponse['policies'][0]>[] = [
		{
			accessorKey: 'name',
			header: 'Policy name',
			cell: ({ row }) => {
				const data = row.original;
				return <div className="flex items-center">{data?.policy?.name}</div>;
			},
		},

		{
			accessorKey: 'counties',
			header: 'Countries',
			cell: ({ row }) => {
				const data = row.original;

				return (
					<div className="flex items-center">
						<AvatarGroup
							size={35}
							avatars={data?.policy?.countries?.map?.((country) => {
								return {
									src: `https://flagcdn.com/${country?.toLowerCase()}.svg`,
									alt: country,
								};
							})}
						/>
					</div>
				);
			},
		},

		{
			accessorKey: 'creator',
			header: 'created By',
			cell: ({ row }) => {
				const data = row.original;

				const durationSinceCreation = formatDistance(
					new Date(data?.policy?.createdAt),
					new Date(),
					{
						addSuffix: true,
					}
				);
				return (
					<div className="flex items-center">
						{!!data?.policy?.createdBy?.image ? (
							<Avatar className="size-9">
								<Image
									className="object-cover"
									width={100}
									height={100}
									src={data?.policy?.createdBy?.image}
									alt="user avatar"
								/>
							</Avatar>
						) : null}
						<div className="ml-2">
							<p className="text-sm">{data?.policy?.createdBy?.name}</p>
							<p className="text-sm text-muted-foreground">{durationSinceCreation}</p>
						</div>
					</div>
				);
			},
		},

		{
			id: 'actions',
			cell: ({ row }) => {
				const data = row.original;
				return (
					<Link
						className="text-foreground"
						href={`/dashboard/policies/${data?.policy?.id}`}
					>
						<Button variant="ghost" size="icon">
							<ArrowRight size={16} />
						</Button>
					</Link>
				);
			},
		},
	];

	const rows: PoliciesResponse['policies'] | undefined = props.policies;

	return (
		<DataTable
			actions={<CreatePolicyAction />}
			title="Policies"
			description={`Displaying ${rows?.length}/${props.totalPolicies} policies`}
			perPageSelectEnabled={true}
			archivedFilterEnabled={true}
			isLoading={isLoading}
			rowSelectionEnabled={false}
			stickyHeader
			lastColumnSticky
			maxHeight={600}
			columns={columns}
			data={rows}
			search={{ useParams: true }}
			defaultPerPage="100"
			totalPages={props.totalPages}
			id="policies"
		/>
	);
}
