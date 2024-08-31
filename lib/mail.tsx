import { PasswordResetEmailTemplate } from '@/components/email-templates/password-reset-email-template';
import { TokenEmailTemplate } from '@/components/email-templates/token-email-template';
import { VerifyEmailEmailTemplate } from '@/components/email-templates/verify-email-email-template';
import { getUserByEmail } from '@/data/user';
import { PasswordResetToken, TwoFactorToken, VerificationToken } from '@prisma/client';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendTwoFactorTokenEmail = async (twoFactorToken: TwoFactorToken) => {
	try {
		const { data, error } = await resend.emails.send({
			from: `${process.env.RESEND_FROM_EMAIL}`,
			to: twoFactorToken.email,
			subject: 'Your two-factor authentication code',
			react: TokenEmailTemplate({
				confirmationCode: twoFactorToken.token,
				codeDuration: '5 minutes',
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

	const changeEmail = !!verificationToken?.newEmail;

	const email = !!verificationToken?.newEmail
		? verificationToken.newEmail
		: verificationToken.email;
	try {
		const { data, error } = await resend.emails.send({
			from: `${process.env.RESEND_FROM_EMAIL}`,
			to: email,
			subject: `Please verify your email ${changeEmail ? 'change' : 'address'}`,
			react: VerifyEmailEmailTemplate({
				type: changeEmail ? 'change' : 'setup',
				userFirstname: email,
				verifyEmailLink: confirmationLink,
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

	const currentUser = await getUserByEmail(passwordResetToken.email);

	try {
		const { data, error } = await resend.emails.send({
			from: `${process.env.RESEND_FROM_EMAIL}`,
			to: passwordResetToken.email,
			subject: 'Please confirm your password reset',
			react: PasswordResetEmailTemplate({
				resetPasswordLink: confirmationLink,
				userFirstname: currentUser?.name ?? passwordResetToken.email,
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
