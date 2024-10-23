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
			<Preview>
				{props.type === 'change' ? 'Confirm Email Change' : 'Verify Your Email Address'}
			</Preview>
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
							<Text className="text-lg font-bold">
								{props.type === 'change'
									? 'Confirm Your Email Change'
									: 'Verify Your Email Address'}
							</Text>
						</Section>
						<Section className="p-6">
							<Text className="text-black text-xl font-semibold">
								Hi {props.userFirstname || 'there'},
							</Text>
							<Text className="text-black mt-2">
								{props.type === 'change'
									? 'You recently requested to change the email address associated with your account.'
									: 'Thanks for signing up! Please verify your email address to complete the setup of your account.'}
							</Text>
							<Button
								className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-md my-4"
								href={props.verifyEmailLink}
							>
								{props.type === 'change' ? 'Confirm Email Change' : 'Verify Email'}
							</Button>
							<Text className="text-gray-700 mb-4">
								If you did not request this, you can safely ignore this email.
							</Text>
							<Text className="text-black font-semibold">Thank you!</Text>
						</Section>
						<Section className="bg-neutral-100 p-4 rounded-b-md text-center">
							<Text className="text-gray-600 text-sm">
								Need help?{' '}
								<Link
									href="https://your-website.com/support"
									className="text-blue-600 underline"
								>
									Contact our support team
								</Link>
								.
							</Text>
							<Text className="text-gray-600 mt-2 text-sm">
								Follow us on{' '}
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
								This is an automated message. If you did not request this, please
								disregard it.
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
