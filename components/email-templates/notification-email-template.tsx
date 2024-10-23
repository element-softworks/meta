import {
	Body,
	Button,
	Container,
	Head,
	Html,
	Img,
	Link,
	Preview,
	Section,
	Tailwind,
	Text,
} from '@react-email/components';

interface NotificationEmailTemplateProps {
	message: string;
}

export const NotificationEmailTemplate = (props: NotificationEmailTemplateProps) => {
	const home = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;

	return (
		<Html>
			<Head />
			<Preview>You have a new notification</Preview>
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
							<Text className="text-lg font-bold">New Notification</Text>
						</Section>
						<Section className="p-6">
							<Text className="text-black text-xl font-semibold">
								You have 1 new notification!
							</Text>
							<Text className="text-black mt-2">{props.message}</Text>
							<Button
								className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-md my-4"
								href={home}
							>
								Go to Dashboard
							</Button>
							<Text className="text-gray-700 mb-4">
								Visit your dashboard to view more details or manage your
								notifications.
							</Text>
							<Text className="text-black font-semibold">
								Thank you for staying connected!
							</Text>
						</Section>
						<Section className="bg-neutral-100 p-4 rounded-b-md text-center">
							<Text className="text-gray-600 text-sm">
								If you need assistance, please{' '}
								<Link
									href={`${process.env.NEXT_PUBLIC_APP_URL}#contact`}
									className="text-blue-600 underline"
								>
									contact our support team
								</Link>
								.
							</Text>
							<Text className="text-gray-600 mt-2 text-sm">
								Stay updated with us on{' '}
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
