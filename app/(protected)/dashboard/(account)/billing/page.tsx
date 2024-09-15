import Checkout from '@/components/checkout';
import { Separator } from '@/components/ui/separator';
import { getTeamById } from '@/data/team';
import { currentUser } from '@/lib/auth';

export default async function SettingsPage() {
	const user = await currentUser();
	const team = await getTeamById(user?.currentTeam ?? '');

	return (
		<main className="flex flex-col max-w-3xl gap-6">
			<div className="flex gap-2 items-center">
				<div className="flex-1">
					<p className="text-xl font-bold">Billing settings</p>
					<p className="text-muted-foreground text-sm">
						Upgrade, manage and pay for your plan here
					</p>
				</div>
			</div>
			<Separator />

			<Checkout stripeCustomerId={team?.team?.stripeCustomerId ?? ''} />
		</main>
	);
}
