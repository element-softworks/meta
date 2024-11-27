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
		password: z.string().min(1, { message: 'Password is required' }),
		newPassword: z
			.string()
			.min(9, { message: 'Password must be at least 9 characters' })
			.refine(
				(password) => {
					if (password?.length < 9) {
						return false;
					} else if (!/[A-Z]/.test(password)) {
						return false;
					} else if (!/[0-9]/.test(password)) {
						return false;
					} else if (!/[A-Za-z0-9]/.test(password)) {
						return false;
					} else {
						return true;
					}
				},
				{
					message: 'Password not strong enough',
				}
			),
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
		password: z
			.string()
			.min(9, { message: 'Password must be at least 9 characters' })
			.refine(
				(password) => {
					if (password?.length < 9) {
						return false;
					} else if (!/[A-Z]/.test(password)) {
						return false;
					} else if (!/[0-9]/.test(password)) {
						return false;
					} else if (!/[A-Za-z0-9]/.test(password)) {
						return false;
					} else {
						return true;
					}
				},
				{
					message: 'Password not strong enough',
				}
			),
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
	password: z
		.string()
		.min(9, { message: 'Password must be at least 9 characters' })
		.refine(
			(password) => {
				if (password?.length < 9) {
					return false;
				} else if (!/[A-Z]/.test(password)) {
					return false;
				} else if (!/[0-9]/.test(password)) {
					return false;
				} else if (!/[A-Za-z0-9]/.test(password)) {
					return false;
				} else {
					return true;
				}
			},
			{
				message: 'Password not strong enough',
			}
		),
	name: z.string().min(1, { message: 'Name is required' }),
});

export const CoachSetupDetailsStepSchema = z.object({
	email: z.string().email(),
	firstName: z.string().min(1, { message: 'First name is required' }),
	lastName: z.string().min(1, { message: 'Last name is required' }),
	password: z
		.string()
		.min(9, { message: 'Password must be at least 9 characters' })
		.refine(
			(password) => {
				if (password?.length < 9) {
					return false;
				} else if (!/[A-Z]/.test(password)) {
					return false;
				} else if (!/[0-9]/.test(password)) {
					return false;
				} else if (!/[A-Za-z0-9]/.test(password)) {
					return false;
				} else {
					return true;
				}
			},
			{
				message: 'Password not strong enough',
			}
		),
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

export const StoresSchema = z.object({
	name: z
		.string()
		.min(1, { message: 'Name is required' })
		.max(35, { message: 'Name is too long' }),
	contactEmail: z.union([z.literal(''), z.string().email()]),
	contactPhone: z.string(),
	maxCapacity: z.union([z.number().int().positive().min(1), z.nan()]).optional(),
	image: z
		.unknown()
		.transform((value) => {
			return value as FileList;
		})
		.refine(
			(data) => {
				if (typeof data?.[0] === 'string' && !!data?.[0]) {
					return true;
				}
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
		.refine(
			(data) => {
				if (!data?.[0]?.size && !data?.[0]) {
					return false;
				}
				return true;
			},
			{
				message: 'Image is required',
			}
		),
	openingTimes: z
		.array(
			z
				.array(
					z.object({
						time: z.string().regex(/^\d{1,2}:\d{2}$/), // Ensures valid time format, e.g., "HH:MM"
						period: z.enum(['am', 'pm']),
					})
				)
				.refine(
					(times) => {
						if (times.length === 0) return true; // if the day is closed

						const [openingTime, closingTime] = times;

						const parseTime = (timeObj: { time: string; period: 'am' | 'pm' }) => {
							const [hours, minutes] = timeObj.time.split(':').map(Number);
							const offset = timeObj.period === 'pm' ? 12 : 0;
							const adjustedHours =
								timeObj.period === 'pm' && hours === 12 ? 0 : hours;
							return adjustedHours + offset + minutes / 100;
						};

						const openingDecimalTime = parseTime(openingTime);
						const closingDecimalTime = parseTime(closingTime);

						return openingDecimalTime <= closingDecimalTime;
					},
					{
						message: 'The opening time must be before or equal to the closing time.',
					}
				)
		)
		.nonempty({ message: 'Opening times are required.' }),
	address: z.object({
		name: z.string().min(1, { message: 'Name is required' }),
		lineOne: z.string().optional(),
		lineTwo: z.string().optional(),
		city: z.string().optional(),
		county: z.string().optional(),
		country: z.string().optional(),
		postCode: z.string().optional(),
		addressType: z.string().optional(),
	}),
	zoom: z
		.number()
		.min(0, { message: 'Zoom cannot be less than 0' })
		.max(24, { message: 'Zoom cannot exceed 24' }),
	longitude: z.number(),
	latitude: z.number(),
	boundingBox: z.array(z.array(z.number()).max(2)).min(2).max(2),
});

export const StoreMapSchema = z.object({
	address: z.object({
		name: z.string().min(1, { message: 'Name is required' }),
		lineOne: z.string().optional(),
		lineTwo: z.string().optional(),
		city: z.string().optional(),
		county: z.string().optional(),
		country: z.string().optional(),
		postCode: z.string().optional(),
		type: z.string().optional(),
	}),
	zoom: z
		.number()
		.min(0, { message: 'Zoom cannot be less than 0' })
		.max(24, { message: 'Zoom cannot exceed 24' }),
	longitude: z.number(),
	latitude: z.number(),
	boundingBox: z.array(z.array(z.number()).min(2).max(2)).min(2).max(2),
});

export const StoreDetailsSchema = z.object({
	name: z
		.string()
		.min(1, { message: 'Name is required' })
		.max(35, { message: 'Name is too long' }),
	contactEmail: z.union([z.literal(''), z.string().email()]),
	contactPhone: z.string(),
	maxCapacity: z.union([z.number().int().positive().min(1), z.nan()]).optional(),
	image: z
		.unknown()
		.transform((value) => {
			return value as FileList;
		})
		.refine(
			(data) => {
				if (typeof data?.[0] === 'string' && !!data?.[0]) {
					return true;
				}
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
		.refine(
			(data) => {
				if (!data?.[0]?.size && !data?.[0]) {
					return false;
				}
				return true;
			},
			{
				message: 'Image is required',
			}
		),
	openingTimes: z
		.array(
			z
				.array(
					z.object({
						time: z.string().regex(/^\d{1,2}:\d{2}$/), // Ensures valid time format, e.g., "HH:MM"
						period: z.enum(['am', 'pm']),
					})
				)
				.refine(
					(times) => {
						if (times.length === 0) return true; // if the day is closed

						const [openingTime, closingTime] = times;

						const parseTime = (timeObj: { time: string; period: 'am' | 'pm' }) => {
							const [hours, minutes] = timeObj.time.split(':').map(Number);
							const offset = timeObj.period === 'pm' ? 12 : 0;
							const adjustedHours =
								timeObj.period === 'pm' && hours === 12 ? 0 : hours;
							return adjustedHours + offset + minutes / 100;
						};

						const openingDecimalTime = parseTime(openingTime);
						const closingDecimalTime = parseTime(closingTime);

						return openingDecimalTime <= closingDecimalTime;
					},
					{
						message: 'The opening time must be before or equal to the closing time.',
					}
				)
		)
		.nonempty({ message: 'Opening times are required.' }),
});

export const StoreAddressValidationSchema = z.object({
	address: z.object({
		name: z.string().min(1, { message: 'Name is required' }),
		lineOne: z.string().min(1, { message: 'Line one is required' }),
		lineTwo: z.string().optional(),
		city: z.string().min(1, { message: 'City is required' }),
		county: z.string().min(1, { message: 'County is required' }),
		country: z.string().min(1, { message: 'Country is required' }),
		postCode: z.string().min(1, { message: 'Post code is required' }),
	}),
});

export const StoresSubmitSchema = z.object({
	name: z
		.string()
		.min(1, { message: 'Name is required' })
		.max(35, { message: 'Name is too long' }),
	contactEmail: z.union([z.literal(''), z.string().email()]),
	contactPhone: z.string(),
	maxCapacity: z.union([z.number().int().positive().min(1), z.nan()]).optional(),
	image: z
		.unknown()
		.transform((value) => {
			return value as FileList;
		})
		.refine(
			(data) => {
				if (typeof data?.[0] === 'string' && !!data?.[0]) {
					return true;
				}

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
		.refine(
			(data) => {
				if (!data?.[0]?.size && !data?.[0]) {
					return false;
				}
				return true;
			},
			{
				message: 'Image is required',
			}
		),
	openingTimes: z
		.array(z.array(z.array(z.string())))
		.nonempty({ message: 'Opening times are required.' }),
	address: z.object({
		name: z.string().min(1, { message: 'Name is required' }),
		lineOne: z.string().optional(),
		lineTwo: z.string().optional(),
		city: z.string().optional(),
		county: z.string().optional(),
		country: z.string().optional(),
		postCode: z.string().optional(),
		addressType: z.string().optional(),
	}),
	zoom: z
		.number()
		.min(0, { message: 'Zoom cannot be less than 0' })
		.max(24, { message: 'Zoom cannot exceed 24' }),
	longitude: z.number(),
	latitude: z.number(),
	boundingBox: z.array(z.array(z.number()).max(2)).min(2).max(2),
});
