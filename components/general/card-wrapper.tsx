'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';

interface CardWrapperProps {
	children?: React.ReactNode;
	title?: string | React.ReactNode;
	description?: string | React.ReactNode;
	footer?: string | React.ReactNode;
}
export function CardWrapper(props: CardWrapperProps) {
	const showCardHeader = props.title || props.description;
	return (
		<Card className={`w-full relative`}>
			{showCardHeader ? (
				<CardHeader>
					{props.title ? <CardTitle>{props.title}</CardTitle> : null}
					{props.description ? (
						<CardDescription>{props.description}</CardDescription>
					) : null}
				</CardHeader>
			) : null}
			<CardContent>{props.children}</CardContent>
			{props.footer ? <CardFooter>{props.footer}</CardFooter> : null}
		</Card>
	);
}
