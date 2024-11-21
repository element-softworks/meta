'use client';

import { BellRing } from 'lucide-react';
import { Switch } from '../ui/switch';
import { useMutation } from '@/hooks/use-mutation';
import { useSession } from 'next-auth/react';
import { emailNotificationsEnabledToggle } from '@/actions/account/email-notifications-enabled-toggle';

interface EmailNotificationsToggleButtonProps {
	checked: boolean;
	userId: string;
}

type emailNotificationsEnabledQueryFormProps = {
	enabled: boolean;
};
export function EmailNotificationsToggleButton(props: EmailNotificationsToggleButtonProps) {
	const { update } = useSession();
	const { query: emailNotificationsEnabledQuery, isLoading } = useMutation<
		emailNotificationsEnabledQueryFormProps,
		{}
	>({
		queryFn: async (values) =>
			await emailNotificationsEnabledToggle(!props.checked, props.userId),
	});

	const handleCheck = () => {
		emailNotificationsEnabledQuery({ enabled: !props.checked });
	};

	return (
		<div className=" flex flex-col sm:flex-row sm:items-center gap-4 rounded-md border p-4">
			<BellRing />
			<div className="flex-1 space-y-1">
				<p className="text-sm font-medium leading-none">Email notifications enabled</p>
				<p className="text-sm text-muted-foreground">
					Control whether you receive email notifications
				</p>
			</div>
			<Switch
				onCheckedChange={() => handleCheck()}
				disabled={isLoading}
				type="submit"
				checked={props.checked ?? false}
			/>
		</div>
	);
}
