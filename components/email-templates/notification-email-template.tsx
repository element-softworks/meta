import * as React from 'react';
import {
	Body,
	Container,
	Head,
	Html,
	Img,
	Link,
	Preview,
	Button,
	Section,
	Tailwind,
	Text,
} from '@react-email/components';
import config from '@/tailwind.config';

interface NotificationEmailTemplateProps {
	message: string;
}

export const NotificationEmailTemplate = (props: NotificationEmailTemplateProps) => {
	const home = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;

	return (
		<Html>
			<Head />
			<Preview>Notification</Preview>
			<Tailwind>
				<Body className="">
					<Container className="bg-neutral-100 border border-neutral-200 rounded-md">
						<Section className="bg-neutral-200 ">
							<Img
								className="py-2 px-6"
								src={`https://www.fmt.se/wp-content/uploads/2023/02/logo-placeholder-image.png`}
								width="75"
								height="75"
								alt="logo"
							/>
						</Section>
						<Section className="p-6 ">
							<Text className="text-black text-2xl font-bold">
								Notification received
							</Text>
							<Text className="text-black">{props.message}</Text>

							<Button
								className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
								href={home}
							>
								View notification
							</Button>

							<Text className="text-black">
								This is a notification from the system
							</Text>
							<Text className="text-black font-bold">Thank you!</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};
