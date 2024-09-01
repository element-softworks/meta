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
import { Suspense, useEffect, useState } from 'react';
import { Input } from './ui/input';
import { useSearchParams } from 'next/navigation';
import { useParam } from '@/hooks/use-param';
import { Checkbox } from './ui/checkbox';
import { ArrowDown, ArrowLeft, ArrowUp, ArrowUpDown } from 'lucide-react';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	search?: string | { useParams: boolean };
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
	search,
	columnVisibilityEnabled = true,
	rowSelectionEnabled = true,
	id,
	totalPages,
	maxHeight,
	stickyHeader = true,
	lastColumnSticky = false,
}: DataTableProps<TData & { id: string }, TValue>) {
	const searchParams = useSearchParams();
	const { mutateParam, mutateParams } = useParam();

	const pageNum = Number(searchParams.get(`${!!id ? `${id}-` : ''}pageNum`)) || 1;
	const perPage = Number(searchParams.get(`${!!id ? `${id}-` : ''}perPage`)) || 100;

	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState({});
	const [searchValue, setSearchValue] = useState('');

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

	const selectionParam = `${!!id ? `${id}-` : ''}selectedRows`;

	useEffect(() => {
		if (!rowSelectionEnabled) return;

		const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original.id);

		mutateParam({
			param: selectionParam,
			value: selectedRows.join(','),
		});
	}, [table.getSelectedRowModel()]);

	useEffect(() => {
		mutateParams({
			[`${!!id ? `${id}-` : ''}pageNum`]: '1',
			[`${!!id ? `${id}-` : ''}search`]: searchValue,
		});
	}, [searchValue]);

	const handleSort = (columnId: string, isDefaultDesc: boolean) => {
		const param = `${!!id ? `${id}-` : ''}${columnId}-sort`;
		let sortValue = 'asc';
		if (searchParams.get(param) === 'asc') {
			sortValue = 'desc';
		} else if (searchParams.get(param) === 'desc') {
			sortValue = 'neutral';
		} else if (!searchParams.get(param)) {
			sortValue = isDefaultDesc ? 'neutral' : 'desc';
		} else {
			sortValue = 'asc';
		}

		mutateParam({
			param: `${!!id ? `${id}-` : ''}${columnId}-sort`,
			value: sortValue,
		});
	};

	return (
		<Suspense fallback={<>Loading....</>}>
			<div className="w-full">
				<div className="flex items-center py-4 gap-2">
					{!!search ? (
						<Input
							placeholder={` ${
								typeof search === 'string' ? `Filter ${search}s...` : 'Search...'
							}`}
							value={
								typeof search === 'string'
									? (table.getColumn(search)?.getFilterValue() as string) ?? ''
									: searchValue
							}
							onChange={(event) => {
								if (typeof search === 'string') {
									table.getColumn(search)?.setFilterValue(event.target.value);
								} else {
									setSearchValue(event.target.value);
								}
							}}
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
									{rowSelectionEnabled ? (
										<TableHead>
											<Checkbox
												checked={
													table.getIsAllPageRowsSelected() ||
													(table.getIsSomePageRowsSelected() &&
														'indeterminate')
												}
												onCheckedChange={(value) =>
													table.toggleAllPageRowsSelected(!!value)
												}
												aria-label="Select all"
											/>
										</TableHead>
									) : null}
									{headerGroup.headers.map((header, index) => {
										const isLastColumn =
											index === headerGroup.headers.length - 1;

										const isSortable = header.column.columnDef.enableSorting;

										const sortParam = searchParams.get(
											`${!!id ? `${id}-` : ''}${header.column.id}-sort`
										);

										const isDefaultDesc = header.column.columnDef.sortDescFirst;

										const sortIcon =
											sortParam === 'asc' ? (
												<ArrowUp className="ml-2 h-4 w-4" />
											) : sortParam === 'desc' ? (
												<ArrowDown className="ml-2 h-4 w-4 " />
											) : isDefaultDesc && !sortParam?.length ? (
												<ArrowDown className="ml-2 h-4 w-4 " />
											) : (
												<ArrowLeft className="ml-2 h-4 w-4" />
											);

										return (
											<TableHead
												key={header.id}
												className={`${
													lastColumnSticky &&
													isLastColumn &&
													'sticky right-0 bg-accent '
												}`}
											>
												{header.isPlaceholder ? null : isSortable ? (
													<Button
														className="px-0"
														variant="ghost"
														onClick={() => {
															handleSort(
																header.column.id,
																isDefaultDesc ?? false
															);
														}}
													>
														{flexRender(
															header.column.columnDef.header,
															header.getContext()
														)}
														{sortIcon}
													</Button>
												) : (
													flexRender(
														header.column.columnDef.header,
														header.getContext()
													)
												)}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody className="">
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => {
									return (
										<TableRow
											key={row.id}
											data-state={row.getIsSelected() && 'selected'}
										>
											{rowSelectionEnabled ? (
												<TableHead>
													<Checkbox
														checked={row.getIsSelected()}
														onCheckedChange={(value) => {
															return row.toggleSelected(!!value);
														}}
														aria-label="Select row"
													/>
												</TableHead>
											) : null}
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
									);
								})
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
