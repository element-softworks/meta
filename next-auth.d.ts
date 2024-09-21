import { DefaultSession } from 'next-auth';

export type ExtendedUser = DefaultSession['user'] & {
	role: UserRole;
	isTwoFactorEnabled: boolean;
	isOAuth: boolean;
	isArchived: boolean;
	teams: Team[] | undefined;
	currentTeam?: string | undefined;
	notificationsEnabled: boolean;
};

declare module 'next-auth' {
	interface Session {
		user: ExtendedUser;
	}
}

// The `JWT` interface can be found in the `next-auth/jwt` submodule
import { JWT } from 'next-auth/jwt';
import { Team } from './db/drizzle/schema/team';

declare module 'next-auth/jwt' {
	/** Returned by the `jwt` callback and `auth`, when using JWT sessions */
	interface JWT {
		/** OpenID ID Token */
		role: UserRole;
		isTwoFactorEnabled: boolean;
		isOAuth: boolean;
		isArchived: boolean;
		image: string;
		teams: Team[] | undefined;
		currentTeam?: string | undefined;
		notificationsEnabled: boolean;
	}
}
