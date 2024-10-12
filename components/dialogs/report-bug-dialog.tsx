'use client';

import { useState } from 'react';
import { DialogWrapper } from '../auth/dialog-wrapper';
import { Button } from '../ui/button';
import { ReportBugForm } from '../forms/report-bug-form';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import { Bug } from 'lucide-react';

interface ReportBugDialogProps {}
export function ReportBugDialog(props: ReportBugDialogProps) {
	const [dialogOpen, setDialogOpen] = useState(false);

	return (
		<DialogWrapper
			size="lg"
			onSubmit={() => {}}
			isLoading={false}
			onOpenChange={(state) => setDialogOpen(state)}
			open={dialogOpen}
			button={
				<DropdownMenuItem
					onClick={(e) => {
						e.stopPropagation();
						e.preventDefault();
						setDialogOpen((prev) => !prev);
					}}
					className="cursor-pointer w-full"
				>
					<Bug className="mr-2 h-4 w-4" />
					<span>Report a bug</span>
				</DropdownMenuItem>
			}
			disableActions
			dialog={{
				title: 'Report a bug',
				description:
					'Write a detailed description of the bug/issue you encountered with replication steps if possible. Include any screenshots or images that may help us understand the issue better.',
			}}
		>
			<ReportBugForm onSubmit={() => setDialogOpen(false)} />
		</DialogWrapper>
	);
}
