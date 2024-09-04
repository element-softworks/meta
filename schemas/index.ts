import { UserRole } from '@prisma/client';
import * as z from 'zod';

export const SettingsSchema = z.object({
	name: z.optional(z.string().min(1, { message: 'Name is required' })),
	isTwoFactorEnabled: z.optional(z.boolean()),
	role: z.enum([UserRole.ADMIN, UserRole.USER]),
});

export const UploadUserAvatarSchema = z.object({
	avatar: z.unknown().transform((value) => {
		return value as FileList;
	}),
});

export const ChangeEmailSchema = z.object({
	email: z.string().email(),
});

export const ResetPasswordSchema = z
	.object({
		password: z.string().min(6, { message: 'Minimum 6 characters required' }),
		newPassword: z.string().min(6, { message: 'Minimum 6 characters required' }),
	})
	.refine(
		(data) => {
			if (data.password && !data.newPassword) {
				return false;
			}
			return true;
		},
		{
			message: 'New password is required!',
			path: ['newPassword'],
		}
	)
	.refine(
		(data) => {
			if (data.newPassword && !data.password) {
				return false;
			}
			return true;
		},
		{
			message: 'Password is required!',
			path: ['password'],
		}
	);

export const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1, { message: 'Password is required' }),
	code: z.optional(z.string()),
});

export const NewPasswordSchema = z.object({
	password: z.string().min(6, { message: 'Minimum 6 characters required' }),
});

export const ResetSchema = z.object({
	email: z.string().email(),
});

export const RegisterSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6, { message: 'Minimum 6 characters required' }),
	name: z.string().min(1, { message: 'Name is required' }),
});
