'use server';
import { addUserToTeam, getIsUserTeamAdmin, getTeamById } from '@/data/team';
import { getUserByEmail } from '@/data/user';
import { db } from '@/db/drizzle/db';
import { teamMember, user } from '@/db/drizzle/schema';
import { currentUser } from '@/lib/auth';
import { sendConciergeEmail, sendNotificationEmail } from '@/lib/mail';
import { createNotification } from '@/lib/notifications';
import { generateConciergeToken } from '@/lib/tokens';
import { InviteTeamUserSchema } from '@/schemas';
import { TeamRole } from '@prisma/client';
import { eq, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';

export const inviteUsersToTeam = async (
	values: z.infer<typeof InviteTeamUserSchema>,
	teamId: string
) => {
	const validatedFields = InviteTeamUserSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: 'There was a problem registering, please try again later' };
	}

	const { users } = validatedFields.data;

	const teamResponse = await getTeamById(teamId);
	const teamMembers = await db.select().from(teamMember).where(eq(teamMember.teamId, teamId));
	const teamUsers = await db
		.select()
		.from(user)
		.where(
			inArray(
				user.id,
				teamMembers.map((member) => member.userId)
			)
		);

	const platformUsers = await db.select().from(user);

	if (!teamResponse.data?.team) {
		return { error: 'Team not found' };
	}

	if (teamResponse.data?.currentMember?.role === TeamRole.USER) {
		return { error: 'You must be an admin to invite users to the team' };
	}

	//Get the users that are already in the team - we do nothing with these and ignore this response
	const usersAlreadyInTeam = users.filter(
		(user) => teamUsers.find((member) => member.email === user.email) !== undefined
	);

	//Get the users that are not on the platform yet - we invite these users to the platform with a concierge email linking to the new team with a signup link
	const existingUsers = platformUsers.filter(
		(user) => users.find((member) => member.email === user.email) !== undefined
	);

	const nonExistingUsersToInvite = users.filter(
		(user) => !existingUsers.find((existingUser) => existingUser.email === user.email)
	);

	if (!!nonExistingUsersToInvite.length) {
		await Promise.all(
			nonExistingUsersToInvite?.map(async (user) => {
				const token = await generateConciergeToken({
					email: user.email,
					name: user?.name ?? '',
					teamId: teamId,
					role: user.role,
				});
				const data = await sendConciergeEmail(token);
				return;
			})
		);
	}

	//Get the users that are on the platform, but not in the team - we invite these users to the team with an email and a notification
	const usersNotInTeam = users.filter(
		(user) =>
			!!existingUsers.find((existingUser) => existingUser.email === user.email) &&
			!teamUsers.find((member) => member.email === user.email)
	);

	if (!!usersNotInTeam.length) {
		await Promise.all(
			usersNotInTeam?.map(async (user) => {
				const existingUser = await getUserByEmail(user.email);

				//add the existing user to the team

				await addUserToTeam(teamId, existingUser?.id ?? '', user.role);

				const notification = await createNotification({
					userId: existingUser?.id ?? '',
					message: `You have added been to the team "${teamResponse?.data?.team?.name}"`,
					title: 'Added to team',
				});
			})
		);
	}

	revalidatePath(`/teams/${teamId}`);

	console.log(
		'usersAlreadyInTeam',
		usersAlreadyInTeam,
		'nonExistingUsersToInvite',
		nonExistingUsersToInvite,
		'usersNotInTeam',
		usersNotInTeam
	);

	return {
		success: 'Users invited to team',
		usersAlreadyInTeam,
		nonExistingUsersToInvite,
		usersNotInTeam,
	};
};
