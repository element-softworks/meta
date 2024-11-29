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
	Font,
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
			<Preview>
				{props.type === 'change' ? 'Confirm Email Change' : 'Verify Your Email Address'}
			</Preview>
			<Tailwind>
				<Body className="bg-white-100">
					<Container className="max-w-xl mx-auto bg-white border border-neutral-200 rounded-md shadow-md">
						<Section className="bg-white rounded-xl p-4 text-center">
							<Img
								className="mx-auto py-2 object-contain"
								src={`/meta-logos/positive-primary/RGB/Meta_lockup_positive primary_RGB.png`}
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
								welcome to Meta
							</Text>
							<Text
								style={{
									fontFamily: 'Open Sans, sans-serif',
								}}
								className="text-black mt-2"
							>
								{props.type === 'change'
									? 'You recently requested to change the email address associated with your account.'
									: `${props.userFirstname}, you’re just one stop away from joining a community of thousands of coaches and coachees working together to level up their skillsets.`}
							</Text>
							<Button
								style={{
									background:
										'linear-gradient(to right, hsla(246, 79%, 51%, 1), hsla(24, 82%, 87%, 1))',
								}}
								className="text-white py-3.5 w-fit !mt-6 [&_span]:m-auto flex items-center justify-center rounded-2xl px-8"
								href={props.verifyEmailLink}
							>
								{props.type === 'change'
									? 'confirm email change'
									: 'verify account'}
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
								@{new Date().getFullYear()} Copyright Meta Ltd. Registered in
								England & Wales no. 14879225
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};
