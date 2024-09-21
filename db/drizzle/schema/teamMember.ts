import { relations, sql } from 'drizzle-orm';
import { foreignKey, index, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from './user';
import { team, teamRole } from './team';
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

export const teamMemberRelations = relations(teamMember, ({ one }) => ({
	team: one(team, {
		fields: [teamMember.teamId],
		references: [team.id],
	}),
	user: one(user, {
		fields: [teamMember.userId],
		references: [user.id],
	}),
}));
