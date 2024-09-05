'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { TeamsDrawer } from './teams-drawer';

export function TeamsButton() {
	const [drawerOpen, setDrawerOpen] = useState(false);
	return (
		<>
			<TeamsDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />

			<Button
				onClick={() => setDrawerOpen((prev) => !prev)}
				variant="secondary"
				className="w-fit px-4 h-6 text-xs"
			>
				Nathan Carters Team
			</Button>
		</>
	);
}
