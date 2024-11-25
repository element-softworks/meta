import { SessionsAnalytics } from '@/components/analytics/sessions-analytics';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export async function generateMetadata() {
	return {
		title: `Analytics | Admin | Dashboard | Meta`,
		description: 'View and analyze your dashboard analytics on Meta.',
		openGraph: {
			title: `Analytics | Admin |  Dashboard | Meta`,
			description: 'View and analyze your dashboard analytics on Meta.',
		},
		twitter: {
			title: `Analytics | Admin |  Dashboard | Meta`,
			description: 'View and analyze your dashboard analytics on Meta.',
		},
	};
}

export default async function AdminAnalyticsPage({ searchParams }: { searchParams: any }) {
	return (
		<main className="flex flex-col  gap-4">
			<div className="">
				<p className="text-xl font-bold">Analytics</p>
				<p className="text-muted-foreground text-sm">
					View and analyze your dashboard analytics
				</p>
			</div>

			<Separator />

			<Tabs defaultValue="sessions" className="">
				<TabsList>
					<TabsTrigger value="sessions">Sessions</TabsTrigger>
				</TabsList>
				<TabsContent value="sessions" className="flex flex-col gap-4">
					<SessionsAnalytics searchParams={searchParams} />
				</TabsContent>
			</Tabs>
		</main>
	);
}
