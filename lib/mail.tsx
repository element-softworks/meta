import { ConciergeEmailTemplate } from '@/components/email-templates/concierge-email-template';
import { NotificationEmailTemplate } from '@/components/email-templates/notification-email-template';
import { PasswordResetEmailTemplate } from '@/components/email-templates/password-reset-email-template';
import { TokenEmailTemplate } from '@/components/email-templates/token-email-template';
import { VerifyEmailEmailTemplate } from '@/components/email-templates/verify-email-email-template';
import { getUserByEmail } from '@/data/user';
import { ConciergeToken } from '@/db/drizzle/schema/conciergeToken';
import { PasswordResetToken } from '@/db/drizzle/schema/passwordResetToken';
import { TwoFactorToken } from '@/db/drizzle/schema/twoFactorToken';
import { VerificationToken } from '@/db/drizzle/schema/verificationToken';

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

export const sendNotificationEmail = async (email: string, message: string, title: string) => {
	try {
		const { data, error } = await resend.emails.send({
			from: `${title} <${process.env.RESEND_FROM_EMAIL}>`,
			to: email,
			subject: 'Notification',
			react: NotificationEmailTemplate({
				message,
			}),
		});

		if (error) {
			return { error: error.message };
		}

		return { success: 'Notification email sent.' };
	} catch (error) {
		return { error: 'There was a problem sending the notification email.' };
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

export const sendConciergeEmail = async (conciergeToken: ConciergeToken) => {
	const confirmationLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/register?token=${conciergeToken.token}`;

	try {
		const { data, error } = await resend.emails.send({
			from: `${process.env.RESEND_FROM_EMAIL}`,
			to: conciergeToken.email,
			subject: 'Welcome to the platform',
			react: ConciergeEmailTemplate({
				email: conciergeToken.email,
				link: confirmationLink,
				name: conciergeToken.name,
			}),
		});

		if (error) {
			return { error: error.message };
		}

		return { success: 'Concierge email sent.' };
	} catch (error) {
		return { error: 'There was a problem sending the concierge email.' };
	}
};
