'use client';

import { useParam } from '@/hooks/use-param';
import { Button } from '../ui/button';
import { useSearchParams } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-current-user';

interface ShowArchivedButtonProps {
	id?: string;
	adminOnly?: boolean;
}

export function ShowArchivedButton(props: ShowArchivedButtonProps) {
	const user = useCurrentUser();
	const { id = '' } = props;

	const searchParams = useSearchParams();
	const { mutateParam, mutateParams } = useParam();
	const archivedQuery = searchParams.get(`${!!id ? `${id}-` : ''}archived`);

	if (props.adminOnly && user?.role !== 'ADMIN') {
		return null;
	}

	return (
		<Button
			onClick={() => {
				mutateParam({
					param: `${!!id ? `${id}-` : ''}archived`,
					value: archivedQuery === 'true' ? 'false' : 'true',
				});
			}}
			className="ml-auto"
			variant="secondary"
		>
			{archivedQuery === 'true' ? 'Show active' : 'Show archived'}
		</Button>
	);
}
