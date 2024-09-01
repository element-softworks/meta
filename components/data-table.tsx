'use client';

import {
	ColumnDef,
	ColumnFiltersState,
	PaginationState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Suspense, useState } from 'react';
import { Input } from './ui/input';
import { useSearchParams } from 'next/navigation';
import { useParam } from '@/hooks/use-param';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	filterColumn?: string;
	columnVisibilityEnabled?: boolean;
	rowSelectionEnabled?: boolean;
	data: TData[];
	id?: string;
	totalPages: number | undefined;
	maxHeight?: number;
	stickyHeader?: boolean;
	lastColumnSticky?: boolean;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	filterColumn,
	columnVisibilityEnabled = true,
	rowSelectionEnabled = true,
	id,
	totalPages,
	maxHeight,
	stickyHeader = true,
	lastColumnSticky = false,
}: DataTableProps<TData, TValue>) {
	const searchParams = useSearchParams();
	const { mutateParam } = useParam();

	const pageNum = Number(searchParams.get(`${!!id ? `${id}-` : ''}pageNum`)) || 1;
	const perPage = Number(searchParams.get(`${!!id ? `${id}-` : ''}perPage`)) || 100;

	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState({});
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: pageNum - 1,
		pageSize: perPage,
	});

	const maxHeightClassName = `[&>div]:max-h-[${maxHeight}px]`;

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		onPaginationChange: setPagination,

		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			pagination,
		},
	});

	return (
		<Suspense fallback={<>Loading....</>}>
			<div className="w-full">
				<div className="flex items-center py-4">
					{!!filterColumn?.length ? (
						<Input
							placeholder={`Filter ${filterColumn}s...`}
							value={
								(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ''
							}
							onChange={(event) =>
								table.getColumn(filterColumn)?.setFilterValue(event.target.value)
							}
							className="max-w-sm"
						/>
					) : null}

					{columnVisibilityEnabled ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" className="ml-auto">
									Columns
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{table
									.getAllColumns()
									.filter((column) => column.getCanHide())
									.map((column) => {
										return (
											<DropdownMenuCheckboxItem
												key={column.id}
												className="capitalize"
												checked={column.getIsVisible()}
												onCheckedChange={(value) =>
													column.toggleVisibility(!!value)
												}
											>
												{column.id}
											</DropdownMenuCheckboxItem>
										);
									})}
							</DropdownMenuContent>
						</DropdownMenu>
					) : null}
				</div>
				<div className={`rounded-md border overflow-scroll ${maxHeightClassName} `}>
					<Table style={{ maxHeight: maxHeight ?? undefined }}>
						<TableHeader className={`${stickyHeader && 'sticky'} z-10 top-0 bg-card `}>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header, index) => {
										const isLastColumn =
											index === headerGroup.headers.length - 1;

										return (
											<TableHead
												key={header.id}
												className={`${
													lastColumnSticky &&
													isLastColumn &&
													'sticky right-0 bg-accent '
												}`}
											>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext()
													  )}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody className="">
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && 'selected'}
									>
										{row.getVisibleCells().map((cell, index) => {
											const isLastColumn =
												index === row.getVisibleCells().length - 1;
											return (
												<TableCell
													key={cell.id}
													className={`${
														lastColumnSticky &&
														isLastColumn &&
														'sticky right-0 bg-accent '
													}`}
												>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext()
													)}
												</TableCell>
											);
										})}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center"
									>
										No results.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>

				<div className="flex items-center justify-end space-x-2 py-4">
					{rowSelectionEnabled ? (
						<div className="flex-1 text-sm text-muted-foreground">
							{table.getFilteredSelectedRowModel().rows.length} of{' '}
							{table.getFilteredRowModel().rows.length} row(s) selected.
						</div>
					) : null}

					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							mutateParam({
								param: `${!!id ? `${id}-` : ''}pageNum`,
								value: String(pageNum - 1),
							});
						}}
						disabled={pageNum <= 1}
					>
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							mutateParam({
								param: `${!!id ? `${id}-` : ''}pageNum`,
								value: String(pageNum + 1),
							});
						}}
						disabled={totalPages ? pageNum >= totalPages : false}
					>
						Next
					</Button>
				</div>
			</div>
		</Suspense>
	);
}
