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

import { updateBugStatus } from '@/actions/system/update-bug-status';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
} from '@/components/ui/select';
import { useMutation } from '@/hooks/use-mutation';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import { StatusIcon } from '../general/status-icon';
import { Badge } from '../ui/badge';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

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
	const [slideIndex, setSlideIndex] = useState(0);
	const [slidesOpen, setSlidesOpen] = useState(false);
	const [slides, setSlides] = useState<{ src: string }[]>([]);

	console.log(slidesOpen, slides, slideIndex);
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
			<Lightbox
				open={slidesOpen}
				index={slideIndex}
				close={() => setSlidesOpen(false)}
				slides={slides}
				plugins={[Fullscreen, Slideshow, Zoom]}
			/>

			<div className="mt-6 flex flex-col gap-4">
				{props.bugs?.map?.((bug, index) => (
					<>
						<Card key={index} className="max-w-2xl">
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
									<div>
										<p className="text-muted-foreground text-sm  mt-4 mb-1">
											Click an image to view in full
										</p>
										<div className="flex flex-row flex-wrap gap-4">
											{bug?.images?.map?.((image, index) => {
												return (
													<Image
														onClick={() => {
															setSlidesOpen(true);
															setSlideIndex(index);
														}}
														alt={`Bug image ${index}`}
														key={index}
														src={image}
														width={200}
														height={200}
														className="rounded-md hover:scale-105 transition-all cursor-pointer"
													/>
												);
											})}
										</div>
									</div>
								) : null}

								<div className="flex gap-4 mt-6">
									<div className="flex-1">
										<Button
											variant="secondary"
											onClick={() => {
												if (readMore === index) {
													setReadMore(false);
													setSlides([]);
													setSlideIndex(0);
													setSlidesOpen(false);
												} else {
													setReadMore(index);
													setSlides(
														bug?.images?.map?.((image) => {
															return { src: image };
														}) ?? []
													);
												}
											}}
										>
											{readMore === index ? 'Show less' : 'Read more'}
										</Button>
									</div>

									<Select
										defaultValue={bug.status}
										onValueChange={(
											value: 'OPEN' | 'CLOSED' | 'IN_PROGRESS'
										) => {
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
					</>
				))}
			</div>
		</InfiniteScroll>
	);
};
