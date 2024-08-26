import { AuthEmailTemplate } from '@/components/email-templates/auth-email-template';
import {
	PasswordResetToken,
	TwoFactorConfirmation,
	TwoFactorToken,
	VerificationToken,
} from '@prisma/client';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendTwoFactorTokenEmail = async (twoFactorToken: TwoFactorToken) => {
	try {
		const { data, error } = await resend.emails.send({
			from: `${process.env.RESEND_FROM_EMAIL}`,
			to: twoFactorToken.email,
			subject: 'Your two-factor authentication code',
			react: AuthEmailTemplate({
				title: 'Confirmation code',
				description: (
					<div>
						<p>Your two-factor authentication code is:</p>
						<h2>{twoFactorToken.token}</h2>
					</div>
				),
			}),
		});

		if (error) {
			return { error: error.message };
		}

		return { success: 'Verification email sent.' };
	} catch (error) {
		return { error: 'There was a problem sending the verification email.' };
	}
};

export const sendVerificationEmail = async (verificationToken: VerificationToken) => {
	const confirmationLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/new-verification?token=${verificationToken.token}`;

	try {
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
			return { error: error.message };
		}

		return { success: 'Verification email sent.' };
	} catch (error) {
		return { error: 'There was a problem sending the verification email.' };
	}
};

export const sendPasswordResetEmail = async (passwordResetToken: PasswordResetToken) => {
	const confirmationLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/new-password?token=${passwordResetToken.token}`;

	try {
		const { data, error } = await resend.emails.send({
			from: `${process.env.RESEND_FROM_EMAIL}`,
			to: passwordResetToken.email,
			subject: 'Please confirm your password reset',
			react: AuthEmailTemplate({
				title: 'Reset your password',
				description: (
					<div>
						<p>Click the link below to reset your password.</p>
						<a href={confirmationLink}>{confirmationLink}</a>
					</div>
				),
			}),
		});

		if (error) {
			return { error: error.message };
		}

		return { success: 'Verification email sent.' };
	} catch (error) {
		return { error: 'There was a problem sending the verification email.' };
	}
};
