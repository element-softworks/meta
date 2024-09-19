import {
	pgTable,
	index,
	text,
	timestamp,
	boolean,
	uniqueIndex,
	foreignKey,
	doublePrecision,
	primaryKey,
	integer,
	pgEnum,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const teamRole = pgEnum('TeamRole', ['OWNER', 'ADMIN', 'USER']);
export const userRole = pgEnum('UserRole', ['ADMIN', 'USER']);

export const team = pgTable(
	'Team',
	{
		id: text('id')
			.primaryKey()
			.notNull()
			.default(sql`gen_random_uuid()`),
		name: text('name').notNull(),
		createdBy: text('createdBy').notNull(),
		createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp('updatedAt', { precision: 3, mode: 'date' }).notNull(),
		isArchived: boolean('isArchived').default(false).notNull(),
		image: text('image'),
		stripeCustomerId: text('stripeCustomerId'),
		stripePaymentId: text('stripePaymentId'),
	},
	(table) => {
		return {
			stripeCustomerIdStripePaymentIdIdx: index(
				'Team_stripeCustomerId_stripePaymentId_idx'
			).using(
				'btree',
				table.stripeCustomerId.asc().nullsLast(),
				table.stripePaymentId.asc().nullsLast()
			),
		};
	}
);

export const customer = pgTable(
	'Customer',
	{
		id: text('id')
			.primaryKey()
			.notNull()
			.default(sql`gen_random_uuid()`),
		teamId: text('teamId').notNull(),
		userId: text('userId').notNull(),
		stripeCustomerId: text('stripeCustomerId').notNull(),
		stripeSubscriptionId: text('stripeSubscriptionId').notNull(),
		startDate: timestamp('startDate', { precision: 3, mode: 'date' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		endDate: timestamp('endDate', { precision: 3, mode: 'date' }).notNull(),
		planId: text('planId').notNull(),
		email: text('email').notNull(),
		status: text('status').notNull(),
		cancelAtPeriodEnd: boolean('cancelAtPeriodEnd').notNull(),
	},
	(table) => {
		return {
			stripeCustomerIdKey: uniqueIndex('Customer_stripeCustomerId_key').using(
				'btree',
				table.stripeCustomerId.asc().nullsLast()
			),
			teamIdUserIdIdx: index('Customer_teamId_userId_idx').using(
				'btree',
				table.teamId.asc().nullsLast(),
				table.userId.asc().nullsLast()
			),
			customerTeamIdFkey: foreignKey({
				columns: [table.teamId],
				foreignColumns: [team.id],
				name: 'Customer_teamId_fkey',
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
		};
	}
);

export const customerInvoice = pgTable(
	'CustomerInvoice',
	{
		id: text('id')
			.primaryKey()
			.notNull()
			.default(sql`gen_random_uuid()`),
		invoiceId: text('invoiceId'),
		customerId: text('customerId').notNull(),
		stripeSubscriptionId: text('stripeSubscriptionId').notNull(),
		amountPaid: doublePrecision('amountPaid').notNull(),
		amountDue: doublePrecision('amountDue').notNull(),
		total: doublePrecision('total').notNull(),
		createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		amountRemaining: doublePrecision('amountRemaining').notNull(),
		invoicePdf: text('invoicePdf'),
		currency: text('currency').notNull(),
		status: text('status').notNull(),
		teamId: text('teamId').notNull(),
		email: text('email').notNull(),
	},
	(table) => {
		return {
			customerIdIdx: index('CustomerInvoice_customerId_idx').using(
				'btree',
				table.customerId.asc().nullsLast()
			),
			customerInvoiceCustomerIdFkey: foreignKey({
				columns: [table.customerId],
				foreignColumns: [customer.id],
				name: 'CustomerInvoice_customerId_fkey',
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
		};
	}
);

export const user = pgTable(
	'User',
	{
		id: text('id')
			.primaryKey()
			.notNull()
			.default(sql`gen_random_uuid()`),
		name: text('name'),
		email: text('email').notNull(),
		emailVerified: timestamp('emailVerified', { precision: 3, mode: 'date' }),
		image: text('image'),
		password: text('password'),
		role: userRole('role').default('USER').notNull(),
		isTwoFactorEnabled: boolean('isTwoFactorEnabled').default(false).notNull(),
		isArchived: boolean('isArchived').default(false).notNull(),
		createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp('updatedAt', { precision: 3, mode: 'date' }).notNull(),
		notificationsEnabled: boolean('notificationsEnabled').default(true).notNull(),
	},
	(table) => {
		return {
			emailKey: uniqueIndex('User_email_key').using('btree', table.email.asc().nullsLast()),
			emailNameIdx: index('User_email_name_idx').using(
				'btree',
				table.email.asc().nullsLast(),
				table.name.asc().nullsLast()
			),
		};
	}
);

export const verificationToken = pgTable(
	'VerificationToken',
	{
		id: text('id')
			.primaryKey()
			.notNull()
			.default(sql`gen_random_uuid()`),
		email: text('email').notNull(),
		newEmail: text('newEmail'),
		token: text('token').notNull(),
		expiresAt: timestamp('expiresAt', { precision: 3, mode: 'date' }).notNull(),
	},
	(table) => {
		return {
			emailTokenKey: uniqueIndex('VerificationToken_email_token_key').using(
				'btree',
				table.email.asc().nullsLast(),
				table.token.asc().nullsLast()
			),
			newEmailTokenIdx: index('VerificationToken_newEmail_token_idx').using(
				'btree',
				table.newEmail.asc().nullsLast(),
				table.token.asc().nullsLast()
			),
			tokenKey: uniqueIndex('VerificationToken_token_key').using(
				'btree',
				table.token.asc().nullsLast()
			),
		};
	}
);

export const conciergeToken = pgTable(
	'ConciergeToken',
	{
		id: text('id')
			.primaryKey()
			.notNull()
			.default(sql`gen_random_uuid()`),
		token: text('token').notNull(),
		expiresAt: timestamp('expiresAt', { precision: 3, mode: 'date' }).notNull(),
		teamId: text('teamId').notNull(),
		email: text('email').notNull(),
		name: text('name').notNull(),
		role: teamRole('role').notNull(),
	},
	(table) => {
		return {
			emailTokenKey: uniqueIndex('ConciergeToken_email_token_key').using(
				'btree',
				table.email.asc().nullsLast(),
				table.token.asc().nullsLast()
			),
			teamIdEmailIdx: index('ConciergeToken_teamId_email_idx').using(
				'btree',
				table.teamId.asc().nullsLast(),
				table.email.asc().nullsLast()
			),
			tokenKey: uniqueIndex('ConciergeToken_token_key').using(
				'btree',
				table.token.asc().nullsLast()
			),
		};
	}
);

export const passwordResetToken = pgTable(
	'PasswordResetToken',
	{
		id: text('id')
			.primaryKey()
			.notNull()
			.default(sql`gen_random_uuid()`),
		email: text('email').notNull(),
		token: text('token').notNull(),
		expiresAt: timestamp('expiresAt', { precision: 3, mode: 'date' }).notNull(),
	},
	(table) => {
		return {
			emailTokenIdx: index('PasswordResetToken_email_token_idx').using(
				'btree',
				table.email.asc().nullsLast(),
				table.token.asc().nullsLast()
			),
			emailTokenKey: uniqueIndex('PasswordResetToken_email_token_key').using(
				'btree',
				table.email.asc().nullsLast(),
				table.token.asc().nullsLast()
			),
			tokenKey: uniqueIndex('PasswordResetToken_token_key').using(
				'btree',
				table.token.asc().nullsLast()
			),
		};
	}
);

export const twoFactorToken = pgTable(
	'TwoFactorToken',
	{
		id: text('id')
			.primaryKey()
			.notNull()
			.default(sql`gen_random_uuid()`),
		email: text('email').notNull(),
		token: text('token').notNull(),
		expiresAt: timestamp('expiresAt', { precision: 3, mode: 'date' }).notNull(),
	},
	(table) => {
		return {
			emailTokenKey: uniqueIndex('TwoFactorToken_email_token_key').using(
				'btree',
				table.email.asc().nullsLast(),
				table.token.asc().nullsLast()
			),
			tokenKey: uniqueIndex('TwoFactorToken_token_key').using(
				'btree',
				table.token.asc().nullsLast()
			),
		};
	}
);

export const userNotification = pgTable(
	'UserNotification',
	{
		id: text('id')
			.primaryKey()
			.notNull()
			.default(sql`gen_random_uuid()`),
		userId: text('userId').notNull(),
		title: text('title').notNull(),
		message: text('message').notNull(),
		readAt: timestamp('readAt', { precision: 3, mode: 'date' }),
		createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp('updatedAt', { precision: 3, mode: 'date' }).notNull(),
	},
	(table) => {
		return {
			userIdIdx: index('UserNotification_userId_idx').using(
				'btree',
				table.userId.asc().nullsLast()
			),
			userNotificationUserIdFkey: foreignKey({
				columns: [table.userId],
				foreignColumns: [user.id],
				name: 'UserNotification_userId_fkey',
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
		};
	}
);

export const twoFactorConfirmation = pgTable(
	'TwoFactorConfirmation',
	{
		id: text('id')
			.primaryKey()
			.notNull()
			.default(sql`gen_random_uuid()`),
		userId: text('userId').notNull(),
	},
	(table) => {
		return {
			userIdKey: uniqueIndex('TwoFactorConfirmation_userId_key').using(
				'btree',
				table.userId.asc().nullsLast()
			),
			twoFactorConfirmationUserIdFkey: foreignKey({
				columns: [table.userId],
				foreignColumns: [user.id],
				name: 'TwoFactorConfirmation_userId_fkey',
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
		};
	}
);

export const teamMember = pgTable(
	'TeamMember',
	{
		teamId: text('teamId').notNull(),
		userId: text('userId').notNull(),
		role: teamRole('role').default('USER').notNull(),
		createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp('updatedAt', { precision: 3, mode: 'date' }).notNull(),
	},
	(table) => {
		return {
			userIdTeamIdIdx: index('TeamMember_userId_teamId_idx').using(
				'btree',
				table.userId.asc().nullsLast(),
				table.teamId.asc().nullsLast()
			),
			teamMemberTeamIdFkey: foreignKey({
				columns: [table.teamId],
				foreignColumns: [team.id],
				name: 'TeamMember_teamId_fkey',
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			teamMemberUserIdFkey: foreignKey({
				columns: [table.userId],
				foreignColumns: [user.id],
				name: 'TeamMember_userId_fkey',
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			teamMemberPkey: primaryKey({
				columns: [table.teamId, table.userId],
				name: 'TeamMember_pkey',
			}),
		};
	}
);

export const account = pgTable(
	'Account',
	{
		userId: text('userId').notNull(),
		type: text('type').notNull(),
		provider: text('provider').notNull(),
		providerAccountId: text('providerAccountId').notNull(),
		refreshToken: text('refresh_token'),
		accessToken: text('access_token'),
		expiresAt: integer('expires_at'),
		tokenType: text('token_type'),
		scope: text('scope'),
		idToken: text('id_token'),
		sessionState: text('session_state'),
		createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp('updatedAt', { precision: 3, mode: 'date' }).notNull(),
	},
	(table) => {
		return {
			userIdIdx: index('Account_userId_idx').using('btree', table.userId.asc().nullsLast()),
			accountUserIdFkey: foreignKey({
				columns: [table.userId],
				foreignColumns: [user.id],
				name: 'Account_userId_fkey',
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			accountPkey: primaryKey({
				columns: [table.provider, table.providerAccountId],
				name: 'Account_pkey',
			}),
		};
	}
);
