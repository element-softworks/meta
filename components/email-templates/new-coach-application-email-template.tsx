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
import { CoachApplication } from '@/db/drizzle/schema/booking-system/coachApplication';

interface NewCoachApplicationEmailTemplateProps {
	application: CoachApplication;
	link: string;
}

export const NewCoachApplicationEmailTemplate = (props: NewCoachApplicationEmailTemplateProps) => {
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
			<Preview>New coach application received</Preview>
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
								new coach application received
							</Text>
							<Text
								style={{
									fontFamily: 'Open Sans, sans-serif',
								}}
								className="text-black mt-2"
							>
								Dear admin,
							</Text>
							<Text
								style={{
									fontFamily: 'Open Sans, sans-serif',
								}}
								className="text-black mt-2"
							>
								A new coach application has been submitted on Coaching Hours. Below
								are the applicant{"'"}s details:
							</Text>

							<div
								style={{
									gap: '8px',
								}}
								className="flex gap-2 flex-row items-center"
							>
								<Img
									className="object-cover rounded-full bg-white"
									src={props?.application?.avatar ?? ''}
									width="55"
									height="55"
									alt="New application avatar"
								/>
								<div
									style={{
										marginLeft: '8px',
									}}
								>
									<Text
										className="text-black"
										style={{
											fontFamily: 'Open Sans, sans-serif',
											fontWeight: 600,
											margin: 0,
										}}
									>
										{props?.application?.firstName}{' '}
										{props?.application?.lastName}
									</Text>
									<Text
										className="-mt-2 text-black"
										style={{
											fontFamily: 'Open Sans, sans-serif',
											fontWeight: 500,
											margin: 0,
											marginTop: '8px',
										}}
									>
										{props?.application?.location}
									</Text>
								</div>
							</div>

							<Text
								style={{
									fontFamily: 'Open Sans, sans-serif',
								}}
								className="text-black mt-2"
							>
								Please review the application within 24 hours and take the necessary
								steps for verification and approval.
							</Text>
							<Button
								style={{
									background:
										'linear-gradient(to right, hsla(246, 79%, 51%, 1), hsla(24, 82%, 87%, 1))',
								}}
								className="text-white py-3.5 w-fit !mt-6 [&_span]:m-auto flex items-center justify-center rounded-2xl px-8"
								href={props.link}
							>
								view application
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
