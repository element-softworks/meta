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

interface TokenEmailTemplateProps {
	confirmationCode: string;
	codeDuration: string;
}

export const TokenEmailTemplate = (props: TokenEmailTemplateProps) => {
	return (
		<Html>
			<Head />
			<Preview>Two Factor Authentication</Preview>
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
							<Text className="text-black text-2xl font-bold">Confirmation code</Text>
							<Text className="text-black">
								Someone recently tried to log in to your account. If this was you,
								enter the code below:
							</Text>
							<Text className="text-black text-4xl font-bold">
								{props.confirmationCode}
							</Text>
							<Text className="text-black">
								{'('}This code is valid for {props.codeDuration}
								{')'}
							</Text>
							<Text className="text-black">
								If you didn&apos;t try to log in or don&apos;t recognize this
								action, please secure your account.
							</Text>
							<Text className="text-black font-bold">Thank you!</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};
