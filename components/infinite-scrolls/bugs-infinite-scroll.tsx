'use client';

import { Bug } from '@/db/drizzle/schema/bug';
import { useParam } from '@/hooks/use-param';
import { ExtendedUser } from '@/next-auth';
import Image from 'next/image';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ClipLoader } from 'react-spinners';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useMutation } from '@/hooks/use-mutation';
import { updateBugStatus } from '@/actions/system/update-bug-status';
import { StatusIcon } from '../general/status-icon';
import { Badge } from '../ui/badge';
interface BugsInfiniteScrollProps {
	bugs: Bug[] | null;
	total: number;
	user: ExtendedUser | undefined;
	perPage: number;
}

type updateBugStatusFormProps = {
	bugId: string;
	status: 'OPEN' | 'CLOSED' | 'IN_PROGRESS';
};
export const BugsInfiniteScroll = (props: BugsInfiniteScrollProps) => {
	const { mutateParam } = useParam();

	const { query: updateBugStatusQuery, isLoading: isUpdatingBugStatus } = useMutation<
		updateBugStatusFormProps,
		{}
	>({
		queryFn: async (values) => await updateBugStatus(values?.status!, values?.bugId!),
	});

	const handleNext = async () => {
		await mutateParam({ param: 'perPage', value: String(props.perPage + 10), scroll: false });
	};

	const [readMore, setReadMore] = useState<boolean | number>(false);

	return (
		<InfiniteScroll
			dataLength={props.bugs?.length ?? 0} //This is important field to render the next data
			next={() => {
				handleNext();
			}}
			hasMore={(props.bugs?.length ?? 0) < (props?.total ?? 0)}
			loader={
				<div className="mt-6">
					<ClipLoader className="m-auto" size={25} />
				</div>
			}
			endMessage={<p className="mt-6 font-semibold">No more bugs to see</p>}
		>
			<div className="mt-6 flex flex-col gap-4">
				{props.bugs?.map?.((bug, index) => (
					<Card key={index} className={`${readMore === index ? '' : 'max-w-2xl'}`}>
						<CardHeader className="w-full">
							<div className="flex items-center gap-4">
								<CardTitle className="flex-1">{bug.title}</CardTitle>

								<StatusIcon
									status={
										bug.status === 'CLOSED'
											? 'successful'
											: bug.status === 'IN_PROGRESS'
												? 'neutral'
												: 'destructive'
									}
								/>
							</div>
						</CardHeader>
						<CardContent className="">
							<CardDescription
								className={`${readMore === index ? 'text-base lg:text-lg text-foreground' : 'line-clamp-1'}`}
							>
								{bug.description}
							</CardDescription>
							{readMore === index && !!bug?.images?.length ? (
								<div className="flex flex-col gap-4 mt-4">
									<p className="text-muted-foreground">Images:</p>
									{bug?.images?.map?.((image, index) => {
										return (
											<Image
												alt={`Bug image ${index}`}
												key={index}
												src={image}
												width={0}
												height={0}
												layout="responsive"
												className="w-full h-full rounded-md"
											/>
										);
									})}
								</div>
							) : null}

							<div className="flex gap-4 mt-6">
								<div className="flex-1">
									<Button
										variant="secondary"
										onClick={() => {
											if (readMore === index) {
												setReadMore(false);
											} else {
												setReadMore(index);
											}
										}}
									>
										{readMore === index ? 'Show less' : 'Read more'}
									</Button>
								</div>

								<Select
									defaultValue={bug.status}
									onValueChange={(value: 'OPEN' | 'CLOSED' | 'IN_PROGRESS') => {
										updateBugStatusQuery({ bugId: bug.id, status: value });
									}}
								>
									<SelectTrigger className="w-fit [&_svg]:hidden">
										<Badge>
											{bug?.status?.split('_')?.join(' ') ?? 'OPEN'}
										</Badge>
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectItem value="OPEN">
												<Badge>OPEN</Badge>
											</SelectItem>
											<SelectItem value="CLOSED">
												<Badge>CLOSED</Badge>
											</SelectItem>
											<SelectItem value="IN_PROGRESS">
												<Badge>IN PROGRESS</Badge>
											</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</InfiniteScroll>
	);
};
