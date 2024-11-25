export async function generateMetadata() {
	return {
		title: `Stores | Dashboard | Meta`,
		description: 'Manage and view stores for Meta.',
		openGraph: {
			title: `Stores | Dashboard | Meta`,
			description: 'Manage and view stores for Meta.',
		},
		twitter: {
			title: `Stores | Dashboard | Meta`,
			description: 'Manage and view stores for Meta.',
		},
	};
}

export default async function StoresPage({ searchParams }: any) {
	return <main className="flex flex-col  gap-4 max-w-2xl"></main>;
}
