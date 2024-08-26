import { ExtendedUser } from '@/next-auth';

interface UserInfoProps {
	user?: ExtendedUser;
}
export function UserInfo(props: UserInfoProps) {
	return <div>{props.user?.name}</div>;
}
