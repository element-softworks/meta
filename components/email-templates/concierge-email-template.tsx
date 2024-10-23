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

interface ConciergeEmailTemplateProps {
	email: string | null;
	name: string;
	link: string;
}

export const ConciergeEmailTemplate = (props: ConciergeEmailTemplateProps) => {
	const home = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;

	return (
		<Html>
			<Head />
			<Preview>Get started with your new account</Preview>
			<Tailwind>
				<Body className="bg-neutral-100">
					<Container className="max-w-lg mx-auto bg-white border border-neutral-200 rounded-md shadow-md">
						<Section className="bg-neutral-200 p-4 rounded-t-md text-center">
							<Img
								className="mx-auto py-2"
								src={`https://www.fmt.se/wp-content/uploads/2023/02/logo-placeholder-image.png`}
								width="75"
								height="75"
								alt="logo"
							/>
							<Text className="text-lg font-bold">Welcome! Set Up Your Account</Text>
						</Section>
						<Section className="p-6">
							<Text className="text-black text-xl font-semibold">
								Hi {props.name || props.email || 'there'},
							</Text>
							<Text className="text-black mt-2">
								We're thrilled to have you on board! Click the link below to set up
								your account and get started right away:
							</Text>
							<Button
								className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-md my-4"
								href={props.link}
							>
								Set Up My Account
							</Button>
							<Text className="text-gray-700 mb-4">
								If you didn’t request this or have any questions, please contact our
								support team.
							</Text>
							<Text className="text-black font-semibold">
								Looking forward to working with you!
							</Text>
						</Section>
						<Section className="bg-neutral-100 p-4 rounded-b-md text-center">
							<Text className="text-gray-600 text-sm">
								If you need help, feel free to{' '}
								<Link
									href="https://your-website.com/support"
									className="text-blue-600 underline"
								>
									contact support
								</Link>
								.
							</Text>
							<Text className="text-gray-600 mt-2 text-sm">
								Stay connected with us on{' '}
								<Link
									href="https://facebook.com"
									className="text-blue-600 underline"
								>
									Facebook
								</Link>
								,{' '}
								<Link
									href="https://twitter.com"
									className="text-blue-600 underline"
								>
									Twitter
								</Link>
								, and{' '}
								<Link
									href="https://linkedin.com"
									className="text-blue-600 underline"
								>
									LinkedIn
								</Link>
								.
							</Text>
						</Section>
						<Section className="text-gray-500 text-xs text-center p-4">
							<Text className="mb-2">
								This is an automated message from our system. If you didn't expect
								this, you can ignore it.
							</Text>
							<Text>
								© 2024 Your Company, Inc. |{' '}
								<Link
									href={`${process.env.NEXT_PUBLIC_APP_URL}/privacy-policy`}
									className="text-blue-600 underline"
								>
									Privacy Policy
								</Link>{' '}
								|{' '}
								<Link
									href={`${process.env.NEXT_PUBLIC_APP_URL}/terms-of-services`}
									className="text-blue-600 underline"
								>
									Terms of Service
								</Link>
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};
