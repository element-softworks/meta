import {
	Body,
	Button,
	Container,
	Font,
	Head,
	Html,
	Img,
	Preview,
	Section,
	Tailwind,
	Text,
} from '@react-email/components';

interface CoachApplicationApprovedEmailTemplateProps {
	userFirstname: string;
}

export const CoachApplicationApprovedEmailTemplate = (
	props: CoachApplicationApprovedEmailTemplateProps
) => {
	return (
		<Html>
			<Head>
				<Font
					fontFamily="Open Sans"
					fallbackFontFamily="Verdana"
					webFont={{
						url: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300..800&display=swap',
						format: 'woff2',
					}}
					fontWeight={500}
					fontStyle="normal"
				/>
				<Font
					fontFamily="Fredoka"
					fallbackFontFamily="Verdana"
					webFont={{
						url: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&display=swap',
						format: 'woff2',
					}}
					fontWeight={700}
					fontStyle="normal"
				/>
			</Head>
			<Preview>coaching application approval</Preview>
			<Tailwind>
				<Body className="bg-white-100">
					<Container className="max-w-xl mx-auto bg-white border border-neutral-200 rounded-md shadow-md">
						<Section className="bg-white rounded-xl p-4 text-center">
							<Img
								className="mx-auto py-2 object-contain"
								src={`https://coaching-hours.s3.eu-west-2.amazonaws.com/logo.png`}
								width="150"
								height="70"
								alt="logo"
							/>
						</Section>
						<Section
							style={{
								fontFamily: 'Fredoka, sans-serif',
							}}
							className="px-8 py-16  bg-[#FFF4EC] rounded-xl"
						>
							<Text className="text-black text-xl font-semibold font-display">
								coaching application approval
							</Text>
							<Text
								style={{
									fontFamily: 'Open Sans, sans-serif',
								}}
								className="text-black mt-2"
							>
								Dear {props.userFirstname},
							</Text>

							<Text
								style={{
									fontFamily: 'Open Sans, sans-serif',
								}}
								className="text-black mt-2"
							>
								We are thrilled to inform you that your application to join Coaching
								Hours as a coach has been successful! After carefully reviewing your
								credentials and experience, we believe you will be a valuable
								addition to our platform.
							</Text>

							<Text
								style={{
									fontFamily: 'Open Sans, sans-serif',
								}}
								className="text-black mt-2"
							>
								Your account is now active, and you can start connecting with
								individuals seeking guidance and development in their career and
								soft skillsets. We are excited for you to bring your expertise to
								the community and help others unlock their full potential.
							</Text>

							<Text
								style={{
									fontFamily: 'Open Sans, sans-serif',
								}}
								className="text-black mt-2"
							>
								To begin, simply log in to your account using the button below and
								start exploring. If you have any questions or require assistance,
								feel free to reach out to our us at{' '}
								<span
									style={{ fontWeight: 'bold' }}
									className="text-primary font-bold"
								>
									team@coachinghours.com
								</span>
								.
							</Text>

							<Text
								style={{
									fontFamily: 'Open Sans, sans-serif',
								}}
								className="text-black mt-2"
							>
								We look forward to seeing the impact you’ll make!
							</Text>

							<Text
								style={{
									fontFamily: 'Open Sans, sans-serif',
								}}
								className="text-black mt-2"
							>
								Warm regards, <br></br>
								The Coaching Hours Team
							</Text>
							<Button
								style={{
									background:
										'linear-gradient(to right, hsla(246, 79%, 51%, 1), hsla(24, 82%, 87%, 1))',
								}}
								className="text-white py-3.5 w-fit !mt-6 [&_span]:m-auto flex items-center justify-center rounded-2xl px-8"
								href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}
							>
								explore the platform
							</Button>
						</Section>

						<Section className="text-black font-light text-xs text-center p-4">
							<Text
								style={{
									fontFamily: 'Open Sans, sans-serif',
									fontWeight: 300,
								}}
								className="mb-2 text-sm font-light"
							>
								@{new Date().getFullYear()} Copyright Coaching Hours Ltd. Registered
								in England & Wales no. 14879225
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};
