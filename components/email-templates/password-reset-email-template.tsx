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
							<Text className="text-lg font-bold">Password Reset Request</Text>
						</Section>
						<Section className="p-6">
							<Text className="text-black text-xl font-semibold">
								Hi {props.userFirstname},
							</Text>
							<Text className="text-black mt-2">
								We received a request to reset your password. If this was you,
								please click the button below to choose a new password:
							</Text>
							<Button
								className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-md my-4"
								href={props.resetPasswordLink}
							>
								Reset Password
							</Button>
							<Text className="text-gray-700 mb-4">
								If you did not request this password reset, you can safely ignore
								this email. Your password will remain unchanged.
							</Text>
							<Text className="text-black font-semibold">
								Thank you for staying secure!
							</Text>
						</Section>
						<Section className="bg-neutral-100 p-4 rounded-b-md text-center">
							<Text className="text-gray-600 text-sm">
								If you encounter any issues or have questions, please{' '}
								<Link
									href="https://your-website.com/support"
									className="text-blue-600 underline"
								>
									contact our support team
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
								disregard or contact our support team for assistance.
							</Text>
							<Text>
								© 2024 Your Company, Inc. |{' '}
								<Link
									href="https://your-website.com/privacy"
									className="text-blue-600 underline"
								>
									Privacy Policy
								</Link>{' '}
								|{' '}
								<Link
									href="https://your-website.com/terms"
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
