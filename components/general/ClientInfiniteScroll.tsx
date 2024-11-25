'use client';

import { useParam } from '@/hooks/use-param';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CenteredLoader } from '../layout/centered-loader';

interface ClientInfiniteScrollProps {
	children: React.ReactNode;
	dataLength: number;
	hasMore: boolean;
	perPage: number;
	increment?: number;
	endMessage?: React.ReactNode;
}

export function ClientInfiniteScroll(props: ClientInfiniteScrollProps) {
	const { increment = 10 } = props;
	const { mutateParam } = useParam();

	const handleNext = async () => {
		console.log('next datatata');
		await mutateParam({
			param: 'perPage',
			value: String(props.perPage + increment),
			scroll: false,
		});
	};

	return (
		<InfiniteScroll
			// className="!overflow-visible"
			dataLength={props.dataLength}
			next={() => {
				handleNext();
			}}
			hasMore={props.hasMore}
			loader={
				<div className="py-10">
					<CenteredLoader />
				</div>
			}
			endMessage={
				!!props.endMessage ? (
					props.endMessage
				) : (
					<p className="mt-6 font-semibold">No more results to see</p>
				)
			}
		>
			{props.children}
		</InfiniteScroll>
	);
}
