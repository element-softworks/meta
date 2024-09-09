'use server';
import { addUserToTeam, getIsUserTeamAdmin } from '@/data/team';
import { getUserByEmail } from '@/data/user';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { sendConciergeEmail, sendNotificationEmail, sendPasswordResetEmail } from '@/lib/mail';
import { generateConciergeToken } from '@/lib/tokens';
import { InviteTeamUserSchema } from '@/schemas';
import { UserRole } from '@prisma/client';
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

	const adminUser = await currentUser();

	const { users } = validatedFields.data;

	const team = await db.team.findUnique({
		where: {
			id: teamId,
		},
		include: {
			members: {
				include: {
					user: true,
				},
			},
		},
	});

	if (!team) {
		return { error: 'Team not found' };
	}

	const isTeamAdmin = await getIsUserTeamAdmin(teamId, adminUser?.id ?? '');

	if (!isTeamAdmin) {
		return { error: 'You must be an admin to invite users to the team' };
	}

	//Get the users that are already in the team - we do nothing with these and ignore this response
	const usersAlreadyInTeam = users.filter(
		(user) => team?.members.find((member) => member.user.email === user.email) !== undefined
	);

	//Get the users that are not on the platform yet - we invite these users to the platform with a concierge email linking to the new team with a signup link
	const existingUsers = await db.user.findMany({
		where: {
			email: {
				in: users.map((user) => user.email),
			},
		},
	});

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
			!team?.members.find((member) => member.user.email === user.email)
	);

	if (!!usersNotInTeam.length) {
		await Promise.all(
			usersNotInTeam?.map(async (user) => {
				const existingUser = await getUserByEmail(user.email);

				//add the existing user to the team
				await addUserToTeam(teamId, existingUser?.id ?? '', user.role);

				await sendNotificationEmail(
					user.email,
					`You have added been to a new team: ${team?.name}`
				);

				const notification = await db.userNotification.create({
					data: {
						dangerouslySetInnerHTML: '',
						userId: existingUser?.id ?? '',
						message: `You have added been to a new team: ${team?.name}`,
						read: false,
					},
				});
			})
		);
	}

	revalidatePath(`/teams/${teamId}`);

	return {
		success: 'Users invited to team',
		usersAlreadyInTeam,
		nonExistingUsersToInvite,
		usersNotInTeam,
	};
};
