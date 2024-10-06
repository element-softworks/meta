'use client';

import { useParam } from '@/hooks/use-param';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ClipLoader } from 'react-spinners';

interface ClientInfiniteScrollProps {
	children: React.ReactNode;
	dataLength: number;
	hasMore: boolean;
	perPage: number;
	increment?: number;
}

export function ClientInfiniteScroll(props: ClientInfiniteScrollProps) {
	const { increment = 10 } = props;
	const { mutateParam } = useParam();

	const handleNext = async () => {
		await mutateParam({
			param: 'perPage',
			value: String(props.perPage + increment),
			scroll: false,
		});
	};

	return (
		<InfiniteScroll
			className="!overflow-hidden"
			dataLength={props.dataLength}
			next={() => {
				handleNext();
			}}
			hasMore={props.hasMore}
			loader={
				<div className="mt-6 mx-auto w-full flex items-center justify-center">
					<ClipLoader className="m-auto" size={25} />
				</div>
			}
			endMessage={<p className="mt-6 font-semibold">No more results to see</p>}
		>
			{props.children}
		</InfiniteScroll>
	);
}
