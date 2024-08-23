import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { Button } from '../ui/button';

interface SocialProps {
	className?: string;
}
export function Social(props: SocialProps) {
	return (
		<div className={`${props.className} flex flex-col w-full gap-y-2 items-center`}>
			<Button className="w-full" variant="outline" size="lg">
				<FcGoogle />
			</Button>

			<Button className="w-full" variant="outline" size="lg">
				<FaGithub />
			</Button>
		</div>
	);
}
