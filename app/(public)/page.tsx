import { Header } from '@/components/marketing/header';
import { MarketingSection } from '@/components/marketing/marketing-section';
import { MarketingSlider } from '@/components/marketing/marketing-slider';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
	return (
		<main className="flex h-full flex-col ">
			<MarketingSection className="pb-4 md:pb-8">
				<Header
					title="Enter a catchy title here with a highlighted section"
					highlighted="highlighted section"
					caption="Caption for the header"
					subtitle="Put a short descriptor or slogan about your product here. This is a good place to explain what your product does and why it's great."
					buttons={
						<>
							<Link className="flex-1 sm:!flex-none" href="/auth/register">
								<Button className="w-full sm:w-fit" size="lg">
									Get started
								</Button>
							</Link>
							<Link className="flex-1 sm:!flex-none" href="/pricing">
								<Button className="w-full sm:w-fit" variant="outline" size="lg">
									See pricing
								</Button>
							</Link>
						</>
					}
				/>
			</MarketingSection>

			<div className={`rounded-2xl  w-full px-4 block md:hidden`}>
				<Image
					priority
					loading="eager"
					className="rounded-xl border-2 border-border"
					src="https://nextjs-saas-boilerplate.s3.us-east-2.amazonaws.com/advanced-analytics.webp"
					alt="Advanced analytics"
					layout="responsive"
					width={1200}
					height={800}
				/>
			</div>
			<MarketingSection disablePaddingTop disableContainer disablePaddingX>
				<MarketingSlider
					priority
					basis="basis-full md:basis-1/2"
					options={{
						loop: true,
						duration: 100,
						align: 'start',
					}}
					slides={[
						{
							image: 'https://nextjs-saas-boilerplate.s3.us-east-2.amazonaws.com/invoice-management.webp',
							alt: 'Invoice management',
						},
						{
							image: 'https://nextjs-saas-boilerplate.s3.us-east-2.amazonaws.com/advanced-analytics.webp',
							alt: 'Advanced analytics',
						},
						{
							image: 'https://nextjs-saas-boilerplate.s3.us-east-2.amazonaws.com/user-management.webp',
							alt: 'User management',
						},
						{
							image: 'https://nextjs-saas-boilerplate.s3.us-east-2.amazonaws.com/advanced-analytics.webp',
							alt: 'Advanced analytics',
						},
						{
							image: 'https://nextjs-saas-boilerplate.s3.us-east-2.amazonaws.com/user-management.webp',
							alt: 'User management',
						},
					]}
				/>
			</MarketingSection>
		</main>
	);
}
