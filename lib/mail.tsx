import { CoachApplicationApprovedEmailTemplate } from '@/components/email-templates/coach-application-approved-email-template';
import { CoachApplicationRejectedEmailTemplate } from '@/components/email-templates/coach-application-rejected-email-template copy';
import { ConciergeEmailTemplate } from '@/components/email-templates/concierge-email-template';
import { NewCoachApplicationEmailTemplate } from '@/components/email-templates/new-coach-application-email-template';
import { NotificationEmailTemplate } from '@/components/email-templates/notification-email-template';
import { PasswordResetEmailTemplate } from '@/components/email-templates/password-reset-email-template';
import { TokenEmailTemplate } from '@/components/email-templates/token-email-template';
import { VerifyCoachEmailTemplate } from '@/components/email-templates/verify-coach-email-template';
import { VerifyEmailEmailTemplate } from '@/components/email-templates/verify-email-email-template';
import { getUserByEmail } from '@/data/user';
import { db } from '@/db/drizzle/db';
import { user } from '@/db/drizzle/schema';
import { CoachApplication } from '@/db/drizzle/schema/booking-system/coachApplication';
import { ConciergeToken } from '@/db/drizzle/schema/conciergeToken';
import { PasswordResetToken } from '@/db/drizzle/schema/passwordResetToken';
import { TwoFactorToken } from '@/db/drizzle/schema/twoFactorToken';
import { VerificationToken } from '@/db/drizzle/schema/verificationToken';
import { eq } from 'drizzle-orm';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendTwoFactorTokenEmail = async (twoFactorToken: TwoFactorToken) => {
	const emailingUser = await getUserByEmail(twoFactorToken.email);
	try {
		const { data, error } = await resend.emails.send({
			from: `${process.env.RESEND_FROM_EMAIL}`,
			to: twoFactorToken.email,
			subject: 'Your two-factor authentication code',
			react: TokenEmailTemplate({
				username: emailingUser?.name ?? twoFactorToken.email,
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

export const sendVerificationEmail = async (
	verificationToken: VerificationToken,
	coach?: boolean
) => {
	const confirmationLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/new-verification?token=${verificationToken.token}`;

	const changeEmail = !!verificationToken?.newEmail;

	const email = !!verificationToken?.newEmail
		? verificationToken.newEmail
		: verificationToken.email;
	try {
		const { data, error } = await resend.emails.send({
			from: `${process.env.RESEND_FROM_EMAIL}`,
			to: email,
			subject: `${
				changeEmail
					? `Change your email address`
					: coach
					? 'Thank you for signing up to be a coach on CoachingHours.com'
					: `Welcome ${
							verificationToken?.name ?? email
					  } to Coaching Hours! Verify your account`
			}`,
			react: coach
				? VerifyCoachEmailTemplate({
						userFirstname: verificationToken?.name ?? email,
						verifyEmailLink: confirmationLink,
				  })
				: VerifyEmailEmailTemplate({
						type: changeEmail ? 'change' : 'setup',
						userFirstname: verificationToken?.name ?? email,
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

export const sendNewApplicationEmail = async (application: CoachApplication) => {
	try {
		const admins = await db.select().from(user).where(eq(user.role, 'ADMIN'));

		await Promise.all(
			admins.map(async (admin) => {
				const { data, error } = await resend.emails.send({
					from: `${process.env.RESEND_FROM_EMAIL}`,
					to: admin.email,
					subject: 'New coach application',
					react: NewCoachApplicationEmailTemplate({
						application,
						link: `${process.env.NEXT_PUBLIC_APP_URL}/admin/coach-applications/${application.id}`,
					}),
				});
			})
		);

		return { success: 'Coach application email sent.' };
	} catch (error) {
		return { error: 'There was a problem sending the coach application email.' };
	}
};

export const sendCoachApplicationStatusEmail = async (
	application: CoachApplication,
	approved?: boolean
) => {
	try {
		const { data, error } = await resend.emails.send({
			from: `${process.env.RESEND_FROM_EMAIL}`,
			to: application?.email ?? '',
			subject: approved
				? 'Congratulations Luke, your application to Coaching Hours is Approved!'
				: 'Application to Coaching Hours',
			react: approved
				? CoachApplicationApprovedEmailTemplate({
						userFirstname: application?.firstName ?? '',
				  })
				: CoachApplicationRejectedEmailTemplate({
						userFirstname: application?.firstName ?? '',
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
			subject: 'Forgot password request for CoachingHours.com',
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
