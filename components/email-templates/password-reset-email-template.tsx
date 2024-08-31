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

interface PasswordResetEmailTemplateProps {
	userFirstname: string;
	resetPasswordLink: string;
}

export const PasswordResetEmailTemplate = (props: PasswordResetEmailTemplateProps) => {
	return (
		<Html>
			<Head />
			<Preview>Reset your password</Preview>
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
								Hi {props.userFirstname},
							</Text>
							<Text className="text-black">
								Someone recently requested a password change for your account. If
								this was you, you can set a new password here:
							</Text>
							<Button
								className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
								href={props.resetPasswordLink}
							>
								Reset password
							</Button>
							<Text className="text-black">
								If you don&apos;t want to change your password or didn&apos;t
								request this, just ignore and delete this message.
							</Text>
							<Text className="text-black font-bold">Thank you!</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};
