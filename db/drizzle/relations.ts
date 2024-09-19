import { relations } from "drizzle-orm/relations";
import { team, customer, customerInvoice, user, userNotification, twoFactorConfirmation, teamMember, account } from "./schema";

export const customerRelations = relations(customer, ({one, many}) => ({
	team: one(team, {
		fields: [customer.teamId],
		references: [team.id]
	}),
	customerInvoices: many(customerInvoice),
}));

export const teamRelations = relations(team, ({many}) => ({
	customers: many(customer),
	teamMembers: many(teamMember),
}));

export const customerInvoiceRelations = relations(customerInvoice, ({one}) => ({
	customer: one(customer, {
		fields: [customerInvoice.customerId],
		references: [customer.id]
	}),
}));

export const userNotificationRelations = relations(userNotification, ({one}) => ({
	user: one(user, {
		fields: [userNotification.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	userNotifications: many(userNotification),
	twoFactorConfirmations: many(twoFactorConfirmation),
	teamMembers: many(teamMember),
	accounts: many(account),
}));

export const twoFactorConfirmationRelations = relations(twoFactorConfirmation, ({one}) => ({
	user: one(user, {
		fields: [twoFactorConfirmation.userId],
		references: [user.id]
	}),
}));

export const teamMemberRelations = relations(teamMember, ({one}) => ({
	team: one(team, {
		fields: [teamMember.teamId],
		references: [team.id]
	}),
	user: one(user, {
		fields: [teamMember.userId],
		references: [user.id]
	}),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));