import * as z from 'zod';

export const SettingsSchema = z.object({
	name: z.optional(z.string().min(1, { message: 'Name is required' })),
	role: z.enum(['ADMIN', 'USER']),
});

export const TwoFactorSchema = z.object({
	isTwoFactorEnabled: z.optional(z.boolean()),
});

export const ContactSchema = z.object({
	name: z.string(),
	email: z.string().email(),
	message: z.string().min(1, { message: 'Message is required' }),
});

export const ReportBugSchema = z.object({
	title: z.string().min(1, { message: 'Title is required' }),
	description: z.string().min(1, { message: 'Description is required' }),
	status: z.enum(['OPEN', 'CLOSED', 'IN_PROGRESS']),
	images: z.array(
		z
			.unknown()
			.transform((value) => {
				return value as FileList;
			})
			.refine(
				(data) => {
					const fileSize = data?.[0]?.size;

					//1Mb = 1000000 bytes
					if (fileSize > 4000000) {
						return false;
					}
					return true;
				},
				{
					message: "File size can't exceed 4MB",
					path: ['image'],
				}
			)
	),
});

export const ChangeTeamRoleSchema = z.object({
	role: z.enum(['ADMIN', 'USER', 'OWNER']),
});

export const TeamsSchema = z.object({
	name: z
		.string()
		.min(1, { message: 'Name is required' })
		.max(35, { message: 'Name is too long' }),
	image: z
		.unknown()
		.transform((value) => {
			return value as FileList;
		})
		.refine(
			(data) => {
				const fileSize = data?.[0]?.size;

				//1Mb = 1000000 bytes
				if (fileSize > 4000000) {
					return false;
				}
				return true;
			},
			{
				message: "File size can't exceed 4MB",
				path: ['image'],
			}
		),
});

export const InviteTeamUserSchema = z.object({
	users: z.array(
		z.object({
			email: z.string().email(),
			role: z.enum(['ADMIN', 'USER', 'OWNER']),
			name: z.string().optional(),
		})
	),
});

export const InviteTeamUserSingleSchema = z.object({
	email: z.string().email(),
	role: z.enum(['ADMIN', 'USER', 'OWNER']),
	name: z.string().optional(),
});

export const UploadUserAvatarSchema = z.object({
	avatar: z
		.unknown()
		.transform((value) => {
			return value as FileList;
		})
		.refine(
			(data) => {
				const fileSize = data?.[0]?.size;

				//1Mb = 1000000 bytes
				if (fileSize > 4000000) {
					return false;
				}
				return true;
			},
			{
				message: "File size can't exceed 4MB",
				path: ['avatar'],
			}
		),
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

export const NewPasswordSchema = z
	.object({
		password: z.string().min(6, { message: 'Minimum 6 characters required' }),
		passwordConfirm: z.string().min(6, { message: 'Minimum 6 characters required' }),
	})
	.superRefine(({ passwordConfirm, password }, ctx) => {
		if (passwordConfirm !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'The passwords did not match',
				path: ['passwordConfirm'],
			});
		}
	});

export const ResetSchema = z.object({
	email: z.string().email(),
});

export const RegisterSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6, { message: 'Minimum 6 characters required' }),
	name: z.string().min(1, { message: 'Name is required' }),
});

export const CoachSetupDetailsStepSchema = z.object({
	email: z.string().email(),
	firstName: z.string().min(1, { message: 'First name is required' }),
	lastName: z.string().min(1, { message: 'Last name is required' }),
	password: z.string().min(6, { message: 'Minimum 6 characters required' }),
	agreedToTerms: z.boolean().refine((value) => value, { message: 'You must agree to the terms' }),
	agreedToMarketing: z.boolean(),
});

export const MoreAboutYouStepSchema = z.object({
	avatar: z
		.unknown()
		.transform((value) => {
			return value as FileList;
		})
		.refine(
			(data) => {
				const fileSize = data?.[0]?.size;

				//1Mb = 1000000 bytes
				if (fileSize > 3000000) {
					return false;
				}
				return true;
			},
			{
				message: "File size can't exceed 3MB",
				path: ['avatar'],
			}
		)
		.refine(
			(value) => {
				if (!value) {
					return false;
				}
				return true;
			},
			{ message: 'Avatar is required', path: ['avatar'] }
		),
	location: z.string().min(1, { message: 'Location is required' }),
	timezone: z.string().min(1, { message: 'Timezone is required' }),
	yearsExperience: z.string().min(1, { message: 'Experience is required' }),
	businessName: z.string().min(1, { message: 'Business name is required' }),
	businessNumber: z.string().min(1, { message: 'Business number is required' }),
});

export const VerificationStepSchema = z.object({
	hoursExperience: z.string().min(1, { message: 'Hours experience is required' }),
	certificates: z
		.array(
			z.object({
				certifiedDate: z.string().min(1, { message: 'Certified date is required' }),
				certificateName: z.string().min(1, { message: 'Certificate name is required' }),
				institution: z.string().min(1, { message: 'Institution is required' }),
				file: z
					.unknown()
					.transform((value) => {
						return value as FileList;
					})
					.refine(
						(data) => {
							const fileSize = data?.[0]?.size;

							//1Mb = 1000000 bytes
							if (fileSize > 3000000) {
								return false;
							}
							return true;
						},
						{
							message: "File size can't exceed 3MB",
							path: ['certificates'],
						}
					)
					.refine(
						(value) => {
							if (!value) {
								return false;
							}
							return true;
						},
						{ message: 'File is required', path: ['file'] }
					),
			})
		)
		.min(1, {
			message: 'At least one certificate is required.',
		}),
});

export const CoachSetupSchema = z.object({
	...CoachSetupDetailsStepSchema.shape,
	...MoreAboutYouStepSchema.shape,
	...VerificationStepSchema.shape,
});
