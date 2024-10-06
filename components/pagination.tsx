'use client';
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';
import { useParam } from '@/hooks/use-param';

interface PaginationProps {
	pageNum: number;
	totalPages: number;
}

export function PaginationComponent(props: PaginationProps) {
	const { mutateParam } = useParam();

	const handlePageChange = (pageNum: number) => {
		mutateParam({ param: 'pageNum', value: String(pageNum), scroll: false });
	};

	if (props.totalPages === 1) return null;

	const returnPaginationItems = () => {
		const items = [];
		const { pageNum, totalPages } = props;

		// Always show first page and last page
		const startPage = 1;
		const endPage = totalPages;

		// Determine if ellipses are needed
		const showStartEllipsis = pageNum > 3;
		const showEndEllipsis = pageNum < totalPages - 2;

		// Add first page
		items.push(
			<PaginationItem key={startPage}>
				<PaginationLink
					isActive={pageNum === startPage}
					onClick={() => handlePageChange(startPage)}
				>
					{startPage}
				</PaginationLink>
			</PaginationItem>
		);

		// Add start ellipsis if necessary
		if (showStartEllipsis) {
			items.push(
				<PaginationItem key="ellipsis-start">
					<PaginationEllipsis />
				</PaginationItem>
			);
		}

		const centerPages = [pageNum - 1, pageNum, pageNum + 1];
		centerPages.forEach((i) => {
			if (i > startPage && i < endPage) {
				items.push(
					<PaginationItem key={i}>
						<PaginationLink
							isActive={pageNum === i}
							onClick={() => handlePageChange(i)}
						>
							{i}
						</PaginationLink>
					</PaginationItem>
				);
			}
		});

		// Add end ellipsis if necessary
		if (showEndEllipsis) {
			items.push(
				<PaginationItem key="ellipsis-end">
					<PaginationEllipsis />
				</PaginationItem>
			);
		}

		// Add last page only if it’s not already included
		items.push(
			<PaginationItem key={endPage}>
				<PaginationLink
					isActive={pageNum === endPage}
					onClick={() => handlePageChange(endPage)}
				>
					{endPage}
				</PaginationLink>
			</PaginationItem>
		);

		return items;
	};

	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						className={
							props.pageNum <= 1
								? 'cursor-not-allowed text-muted-foreground hover:bg-transparent hover:text-muted-foreground'
								: 'cursor-pointer'
						}
						onClick={() => handlePageChange(Math.max(1, props.pageNum - 1))}
					/>
				</PaginationItem>

				{returnPaginationItems()}

				<PaginationItem>
					<PaginationNext
						className={
							props.pageNum >= props.totalPages
								? 'cursor-not-allowed text-muted-foreground hover:bg-transparent hover:text-muted-foreground'
								: 'cursor-pointer'
						}
						onClick={() =>
							handlePageChange(Math.min(props.totalPages, props.pageNum + 1))
						}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
