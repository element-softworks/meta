'use client';

import { Skeleton } from '@/components/ui/skeleton';
import {
	Cell,
	ColumnDef,
	ColumnFiltersState,
	PaginationState,
	Row,
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
import { useParam } from '@/hooks/use-param';
import { ArrowDown, ArrowLeft, ArrowUp } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '../ui/select';
import { SelectSeparator } from '@radix-ui/react-select';

interface DataTableProps<TData, TValue> {
	title?: string;
	description?: string;
	archivedFilterEnabled?: boolean;
	columns: ColumnDef<TData, TValue>[];
	search?: string | { useParams: boolean };
	perPageSelectEnabled?: boolean;
	columnVisibilityEnabled?: boolean;
	rowSelectionEnabled?: boolean;
	data: TData[] | undefined;
	id?: string;
	totalPages: number | undefined;
	maxHeight?: number;
	stickyHeader?: boolean;
	lastColumnSticky?: boolean;
	isLoading?: boolean;
	defaultPerPage?: '5' | '10' | '20' | '50' | '100';
}

export function DataTable<TData, TValue>({
	title,
	description,
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
	isLoading = false,
	archivedFilterEnabled = false,
	perPageSelectEnabled = true,
	defaultPerPage = '100',
}: DataTableProps<TData, TValue>) {
	const searchParams = useSearchParams();
	const { mutateParam, mutateParams } = useParam();

	const pageNum = Number(searchParams.get(`${!!id ? `${id}-` : ''}pageNum`)) || 1;
	const perPage = Number(searchParams.get(`${!!id ? `${id}-` : ''}perPage`)) || defaultPerPage;

	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState({});
	const [searchValue, setSearchValue] = useState('');
	const [customPerPage, setCustomPerPage] = useState(String(perPage));

	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: pageNum - 1,
		pageSize: Number(perPage),
	});

	const maxHeightClassName = `[&>div]:max-h-[${maxHeight}px]`;

	const table = useReactTable({
		data: data ?? [],
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

		const selectedRows = table
			.getSelectedRowModel()
			.rows.map((row) => (row.original as TData & { id: string }).id);

		mutateParam({
			param: selectionParam,
			value: selectedRows.join(','),
		});
	}, [
		table.getSelectedRowModel(),
		mutateParam,
		rowSelection,
		rowSelectionEnabled,
		selectionParam,
		table,
	]);

	useEffect(() => {
		mutateParams(
			{
				[`${!!id ? `${id}-` : ''}pageNum`]: '1',
				[`${!!id ? `${id}-` : ''}search`]: searchValue,
			},
			{ scroll: false }
		);
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

	const archivedQuery = searchParams.get(`${!!id ? `${id}-` : ''}archived`);

	return (
		<Suspense fallback={<>Loading....</>}>
			<div className="w-full">
				{!!title && (
					<div className="pt-4 pb-2">
						<p className="text-md font-semibold">{title}</p>
						<p className="text-xs text-muted-foreground">{description}</p>
					</div>
				)}
				<div className="flex items-center pb-4  gap-2">
					{!!search ? (
						<Input
							disabled={isLoading}
							placeholder={` ${
								typeof search === 'string' ? `Filter ${search}s...` : 'Search...'
							}`}
							value={
								typeof search === 'string'
									? ((table.getColumn(search)?.getFilterValue() as string) ?? '')
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
					<div className="ml-auto flex gap-2">
						{!!archivedFilterEnabled ? (
							<Button
								onClick={() => {
									mutateParam({
										param: `${!!id ? `${id}-` : ''}archived`,
										value: archivedQuery === 'true' ? 'false' : 'true',
									});
								}}
								className="ml-auto"
								variant="ghost"
							>
								{archivedQuery === 'true' ? 'Show active' : 'Show archived'}
							</Button>
						) : null}

						{columnVisibilityEnabled ? (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" disabled={isLoading}>
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
				</div>
				<div
					className={`rounded-md border overflow-hidden no-scrollbar ${maxHeightClassName} `}
				>
					<Table maxHeight={maxHeight}>
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
														disabled={isLoading}
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
							{table.getRowModel().rows?.length || isLoading ? (
								(isLoading
									? Array.from({ length: 10 }).map((r, i) => ({ id: i }))
									: table.getRowModel().rows
								)?.map((rowData) => {
									const row = rowData as Row<TData> | undefined;
									return (
										<TableRow
											key={row?.id}
											data-state={row?.getIsSelected?.() && 'selected'}
										>
											{rowSelectionEnabled ? (
												<TableHead>
													<Checkbox
														checked={row?.getIsSelected()}
														onCheckedChange={(value) => {
															return row?.toggleSelected(!!value);
														}}
														aria-label="Select row"
													/>
												</TableHead>
											) : null}
											{(isLoading
												? Array.from({
														length: table.getAllColumns()?.length,
													}).map((r, i) => ({ id: i }))
												: row?.getVisibleCells?.()
											)?.map((cellData, index) => {
												const cell = cellData as Cell<TData, unknown>;
												const isLastColumn =
													index ===
													(row?.getVisibleCells?.()?.length ?? 0) - 1;
												return (
													<TableCell
														key={cell?.id}
														className={`py-2 ${
															lastColumnSticky &&
															isLastColumn &&
															'sticky right-0 bg-accent '
														}`}
													>
														{isLoading ? (
															<Skeleton className="h-4 w-full" />
														) : (
															flexRender(
																cell?.column?.columnDef?.cell,
																cell?.getContext?.()
															)
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

					{perPageSelectEnabled ? (
						<Select
							defaultValue={String(perPage)}
							onValueChange={(value: string) => {
								mutateParams(
									{
										[`${!!id ? `${id}-` : ''}pageNum`]: '1',
										[`${!!id ? `${id}-` : ''}perPage`]: value,
									},
									{ scroll: false }
								);
							}}
						>
							<p className="text-sm">Per page</p>
							<SelectTrigger className="w-fit">
								<SelectValue placeholder={`${perPage}`} />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Results per page</SelectLabel>
									<SelectItem className="cursor-pointer" value="5">
										5
									</SelectItem>
									<SelectItem className="cursor-pointer" value="10">
										10
									</SelectItem>
									<SelectItem className="cursor-pointer" value="20">
										20
									</SelectItem>
									<SelectItem className="cursor-pointer" value="50">
										50
									</SelectItem>
									<SelectItem className="cursor-pointer" value="100">
										100
									</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
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
