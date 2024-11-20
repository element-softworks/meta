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

interface CoachApplicationRejectedEmailTemplateProps {
	userFirstname: string;
}

export const CoachApplicationRejectedEmailTemplate = (
	props: CoachApplicationRejectedEmailTemplateProps
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
			<Preview>coaching application rejected</Preview>
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
								coaching application rejected
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
								Thank you for your interest in becoming a coach on Coaching Hours.
								After reviewing your application, we regret to inform you that it
								has not been successful at this time.
							</Text>

							<Text
								style={{
									fontFamily: 'Open Sans, sans-serif',
								}}
								className="text-black mt-2"
							>
								We greatly appreciate the effort you put into your submission, and
								this decision was not made lightly. While we won{"'"}t be moving
								forward, we encourage you to continue pursuing coaching
								opportunities and to consider reapplying in the future as our
								platform evolves.
							</Text>

							<Text
								style={{
									fontFamily: 'Open Sans, sans-serif',
								}}
								className="text-black mt-2"
							>
								Thank you again for your interest, and we wish you the very best in
								your future endeavours.
							</Text>

							<Text
								style={{
									fontFamily: 'Open Sans, sans-serif',
								}}
								className="text-black mt-2"
							>
								Kind regards, <br></br>
								The Coaching Hours Team
							</Text>
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
