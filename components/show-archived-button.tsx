'use client';

import { useParam } from '@/hooks/use-param';
import { Button } from './ui/button';
import { useSearchParams } from 'next/navigation';

interface ShowArchivedButtonProps {
	id?: string;
}

export function ShowArchivedButton(props: ShowArchivedButtonProps) {
	const { id = '' } = props;

	const searchParams = useSearchParams();
	const { mutateParam, mutateParams } = useParam();
	const archivedQuery = searchParams.get(`${!!id ? `${id}-` : ''}archived`);

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
