'use client';

import { useCurrentUser } from '@/hooks/use-current-user';
import { Pen, Plus } from 'lucide-react';
import { useState } from 'react';
import FormDrawer from '../general/form-drawer';
import { Button } from '../ui/button';
import { FixtureTypeForm } from './form/fixture-type-form';
import { FixtureType } from '@/db/drizzle/schema/fixtureType';

export function UpdateFixtureTypeAction(
	props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
		button?: React.ReactNode;
		fixtureType?: FixtureType;
	}
) {
	const [open, setOpen] = useState(false);

	const onOpenChange = (open: boolean) => {
		setOpen(open);
	};

	const user = useCurrentUser();

	if (user?.role !== 'ADMIN') {
		return null;
	}

	return (
		<>
			{props.button ? (
				<div onClick={() => setOpen((prev) => !prev)}>{props.button}</div>
			) : (
				<Button
					{...props}
					disabled={!props.fixtureType}
					className="w-fit aspect-square"
					size="icon"
					onClick={() => setOpen((prev) => !prev)}
				>
					<Pen />
				</Button>
			)}

			<FormDrawer
				title="Update fixture type"
				description="A fixture type is a physical setup configuration assigned to stores."
				open={open}
				onOpenChange={onOpenChange}
			>
				<FixtureTypeForm
					fixtureType={props.fixtureType}
					onComplete={() => {
						setOpen(false);
					}}
				/>
			</FormDrawer>
		</>
	);
}
