import { AuthEmailTemplate } from '@/components/email-templates/auth-email-template';
import { VerificationToken } from '@prisma/client';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (verificationToken: VerificationToken) => {
	const confirmationLink = `http://localhost:3000/auth/new-verification?token=${verificationToken.token}`;

	try {
		console.log(process.env.RESEND_FROM_EMAIL, 'resend from email');
		const { data, error } = await resend.emails.send({
			from: `${process.env.RESEND_FROM_EMAIL}`,
			to: verificationToken.email,
			subject: 'Please verify your email',
			react: AuthEmailTemplate({
				title: 'Verify your email',
				description: (
					<div>
						<p>Click the link below to verify your email address.</p>
						<a href={confirmationLink}>{confirmationLink}</a>
					</div>
				),
			}),
		});

		if (error) {
			console.error(error);
			return { error: 'There was a problem sending the verification email.' };
		}

		return Response.json(data);
	} catch (error) {
		console.error(error);
		return { error: 'There was a problem sending the verification email.' };
	}
};
