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

interface TokenEmailTemplateProps {
	confirmationCode: string;
	codeDuration: string;
	username: string;
}

export const TokenEmailTemplate = (props: TokenEmailTemplateProps) => {
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
			<Preview>Two-Factor Authentication - Action Required</Preview>
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
								your two factor authentication code
							</Text>

							<Text
								style={{
									fontFamily: 'Open Sans, sans-serif',
								}}
								className="text-black mt-2"
							>
								{`Hi ${props.username},`}
							</Text>
							<Text
								style={{
									fontFamily: 'Open Sans, sans-serif',
								}}
								className="text-black mt-2"
							>
								This code is valid for the next {props.codeDuration}. If you did not
								make this request, please secure your account immediately.
							</Text>

							<Text className="text-black text-4xl font-semibold font-display my-4">
								{props.confirmationCode}
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
