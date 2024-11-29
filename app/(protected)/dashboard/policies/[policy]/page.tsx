import { getPolicyById } from '@/actions/policy/get-policy-by-id';
import { AvatarGroup } from '@/components/general/avatar-group';
import { Map } from '@/components/general/map';
import { PoliciesLayout } from '@/components/layouts';
import { ArchivePolicyAction } from '@/components/policies/archive-policy-action';
import { EditPolicyAction } from '@/components/policies/edit-policy-action';
import { AnswersTable } from '@/components/tables/answers-table';
import PolicyQuestionsTableContainer from '@/components/tables/policy-questions-table-container';
import { QuestionsTable } from '@/components/tables/questions-table';
import QuestionsTableContainer from '@/components/tables/questions-table-container';
import { Separator } from '@/components/ui/separator';
import { db } from '@/db/drizzle/db';
import { policy } from '@/db/drizzle/schema';
import { currentUser } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { Suspense } from 'react';

export async function generateMetadata({ params }: any) {
	const [policyResponse] = await db.select().from(policy).where(eq(policy.id, params.policy));

	return {
		title: `${policyResponse?.name} | Policies | Dashboard | Meta`,
		description: `${policyResponse?.name}`,
		openGraph: {
			title: `${policyResponse?.name} | Policies | Dashboard | Meta`,
			description: `${policyResponse?.name}`,
		},
		twitter: {
			title: `${policyResponse?.name} | Policies | Dashboard | Meta`,
			description: `${policyResponse?.name}`,
		},
	};
}

export default async function LocationPage({
	params,
	searchParams,
}: {
	params: { organisation: string; policy: string };
	searchParams: any;
}) {
	const user = await currentUser();
	const policyResponse = await getPolicyById(params.policy);

	const isAdmin = user?.role === 'ADMIN';

	const clusters = policyResponse?.positions?.map((position, index) => ({
		longitude: position?.longitude,
		latitude: position?.latitude,
		id: index,
		name: position?.country,
	}));

	return (
		<PoliciesLayout
			crumbs={[
				{
					active: false,
					text: `Policies`,
				},
				{
					active: true,
					text: `Policy`,
				},
			]}
		>
			<div className="flex flex-col  gap-4 h-full">
				<div className="flex gap-4">
					<h1 className="text-lg lg:text-xl font-medium flex-1">
						{policyResponse?.policy?.name}
					</h1>
					<div className="flex gap-2">
						<ArchivePolicyAction policy={policyResponse?.policy} />
						<EditPolicyAction policy={policyResponse} />
					</div>
				</div>

				{/* HEADER SECTION */}
				<section className="flex flex-col md:flex-row gap-4">
					<div className="flex flex-col gap-y-4">
						{/* <div>
							<p className="font-medium text-muted-foreground">Address</p>
							<p className="max-w-[35ch]">
								{policyResponse?.store?.address?.addressName ?? ''}
							</p>
						</div> */}

						<div>
							<p className="font-medium text-muted-foreground">Countries</p>
							<div className="flex items-center">
								<AvatarGroup
									size={35}
									avatars={policyResponse?.countries?.map?.((country) => {
										return {
											src: `https://flagcdn.com/${country?.toLowerCase()}.svg`,
											alt: country ?? '',
										};
									})}
								/>
							</div>
						</div>
					</div>
				</section>

				<div>
					<Separator className="my-4 -mx-4 w-[105%]" />
				</div>

				<div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
					<div className="xl:col-span-2 ">
						<Suspense
							fallback={<AnswersTable answers={[]} totalPages={1} isLoading={true} />}
						>
							<PolicyQuestionsTableContainer
								policyId={params.policy}
								searchParams={searchParams}
							/>
						</Suspense>
					</div>
					<div className="flex flex-col gap-6  col-span-1 mb-10 xl:mb-0">
						{/* MAP SECTION */}
						<aside className="h-[280px] xl:h-full">
							<div className="flex-1">
								<p className="text-xl lg:text-2xl font-semibold">Stores</p>
								<p className="text-sm font-medium text-muted-foreground mb-2">
									{policyResponse?.stores?.length} stores in this policy
								</p>
							</div>
							<Map
								height="96%"
								centreMarker={false}
								draggableMarker={false}
								expandable={false}
								directions={false}
								clusters={clusters}
							/>
						</aside>
					</div>
				</div>
			</div>
		</PoliciesLayout>
	);
}
