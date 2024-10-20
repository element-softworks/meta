import { TeamsForm } from '@/components/forms/teams-form';
import { Separator } from '@/components/ui/separator';

export async function generateMetadata() {
	return {
		title: `Setup | NextJS SaaS Boilerplate`,
		description: 'Setup your team on NextJS SaaS Boilerplate.',
		openGraph: {
			title: `Setup | NextJS SaaS Boilerplate`,
			description: 'Setup your team on NextJS SaaS Boilerplate.',
		},
		twitter: {
			title: `Setup | NextJS SaaS Boilerplate`,
			description: 'Setup your team on NextJS SaaS Boilerplate.',
		},
	};
}

export default async function SetupPage() {
	return (
		<main className="flex flex-col gap-4 max-w-4xl w-full">
			<div className="">
				<p className="text-xl font-bold">Lets get you setup</p>
				<p className="text-muted-foreground text-sm">Create a team to get started</p>
			</div>
			<Separator />
			<div className="flex flex-col gap-2">
				<TeamsForm />
			</div>
		</main>
	);
}
