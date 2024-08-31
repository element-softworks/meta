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

interface VerifyEmailEmailTemplateProps {
	userFirstname: string | null;
	verifyEmailLink: string;
	type: 'change' | 'setup';
}

export const VerifyEmailEmailTemplate = (props: VerifyEmailEmailTemplateProps) => {
	return (
		<Html>
			<Head />
			<Preview>{props.type === 'change' ? 'Change' : 'Verify'} your email address</Preview>
			<Tailwind config={config}>
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
								Verify your email {props.type === 'change' ? 'change' : 'address'}
							</Text>
							<Text className="text-black">
								Hi {props.userFirstname}, you recently requested to{' '}
								{props.type === 'change' ? 'change' : 'verify'} your email address.
								Click the link below to complete the process:
							</Text>
							<Button
								className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
								href={props.verifyEmailLink}
							>
								{props.type === 'change' ? 'change' : 'verify'} email
							</Button>
							<Text className="text-black">
								If you didn&apos;t request this, just ignore and delete this
								message.
							</Text>
							<Text className="text-black font-bold">Thank you!</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};
