import { LoginButton } from '../auth/login-button';
import { Button } from '../ui/button';

interface KeyPointListProps {
	title: string;
	subtitle?: string;
	keyPoints: {
		icon: React.ReactNode;
		point: React.ReactNode;
	}[];
}

export function KeyPointList(props: KeyPointListProps) {
	return (
		<div className="relative flex md:items-center flex-col gap-2 md:gap-4 text-start md:text-center">
			<h2 className="font-semibold text-2xl md:text-4xl lg:text-5xl max-w-[22ch]">
				{props.title}
			</h2>

			{!!props.subtitle ? (
				<p className="text-base md:text-lg font-normal text-muted-foreground max-w-[65ch]">
					{props.subtitle}
				</p>
			) : null}

			<div className="flex flex-col gap-6 md:gap-12 mt-4 lg:mt-8 max-w-3xl items-center">
				{props.keyPoints.map((keyPoint, index) => (
					<div
						key={index}
						className="flex flex-col md:flex-row gap-2 md:gap-4 items-start "
					>
						{keyPoint.icon}
						{keyPoint.point}
					</div>
				))}

				<div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-center md:mt-8 w-full">
					<p className="text-xl ">We{"'"}ve got what you need </p>
					<LoginButton>
						<Button>Sign up today</Button>
					</LoginButton>
				</div>
			</div>
		</div>
	);
}
