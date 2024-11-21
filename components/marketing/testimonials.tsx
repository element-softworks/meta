import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardContent, CardDescription, CardHeader } from '../ui/card';

interface TestimonialsProps {
	title: string;
	description?: string;
	testimonials: {
		name: string;
		subtitle: string;
		quote: string;
		image: string;
	}[];
}

export function Testimonials(props: TestimonialsProps) {
	//Split the testimonials into three groups
	const group1 = props.testimonials.slice(0, props.testimonials.length / 3);
	const group2 = props.testimonials.slice(
		props.testimonials.length / 3,
		(props.testimonials.length / 3) * 2
	);
	const group3 = props.testimonials.slice(
		(props.testimonials.length / 3) * 2,
		props.testimonials.length
	);

	const groupsArray = [group1, group2, group3];

	return (
		<section className="flex flex-col items-start  md:items-center gap-4 md:gap-16 text-start md:text-center">
			<div className="flex md:items-center flex-col">
				<h2 className="w-full font-semibold text-2xl md:text-4xl lg:text-5xl max-w-[22ch]">
					{props.title}
				</h2>
				{!!props.description ? (
					<p className="text-base  mt-4 md:text-lg font-normal text-muted-foreground max-w-[65ch]">
						{props.description}
					</p>
				) : null}
			</div>
			<div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-3">
				{groupsArray.map((group, index) => (
					<div
						key={index}
						className={`grid gap-4 md:gap-6 ${index !== 0 ? 'hidden md:grid' : ''}`}
					>
						{group.map((testimonial, index) => (
							<Card key={index} className="flex flex-col gap-2 ">
								<CardContent>
									<CardHeader className="px-0">
										<div className="flex gap-2 items-center">
											<Avatar className="size-8 relative">
												{!!testimonial.image && (
													<AvatarImage
														width={35}
														height={35}
														src={testimonial.image}
														alt={testimonial.name}
													/>
												)}
												<AvatarFallback>
													{testimonial?.name?.slice(0, 2)}
												</AvatarFallback>
											</Avatar>
											<div className="text-start ">
												<p className="text-base font-medium">
													{testimonial.name}
												</p>
												<CardDescription className="text-muted-foreground text-xs">
													{testimonial.subtitle}
												</CardDescription>
											</div>
										</div>
									</CardHeader>
									<p className="text-start text-base">
										{'"'}
										{testimonial.quote}
										{'"'}
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				))}
			</div>
		</section>
	);
}
