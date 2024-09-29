import { Header } from '@/components/marketing/header';
import { KeyPointList } from '@/components/marketing/key-point-list';
import { MarketingSection } from '@/components/marketing/marketing-section';
import { MarketingSlider } from '@/components/marketing/marketing-slider';
import { MarqueeText } from '@/components/marketing/marquee-text';
import { Button } from '@/components/ui/button';
import { ChartArea, Goal, Pointer } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Marquee from 'react-fast-marquee';

export default function Home() {
	return (
		<main className="flex h-full flex-col ">
			<MarketingSection className="pb-4 md:pb-8 pt-8 md:pt-16">
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

			<div className={`rounded-2xl  w-full px-4 block md:hidden `}>
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
						duration: 100,
						align: 'center',
						startIndex: 0,
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
					]}
				/>
			</MarketingSection>

			<MarketingSection disablePaddingTop>
				<MarqueeText text={['Built using', 'NextJS', 'Shadcn/ui', 'Tailwind css']} />
			</MarketingSection>

			<MarketingSection disablePaddingTop>
				<KeyPointList
					title="Enter Your Section Title Here"
					subtitle="Provide a brief description here. Summarize the value or key benefits of your product in a few sentences."
					keyPoints={[
						{
							icon: <Pointer size={50} />, // Replace with a relevant Lucide icon, e.g., Target, Rocket, ShieldCheck
							point: (
								<p className="text-start text-base md:text-xl">
									Provide a concise description of your first key benefit here.
									Explain the process, outcome, or unique feature of your product
									or service in a way that{' '}
									<span className="font-bold">resonates with your audience.</span>
								</p>
							),
						},
						{
							icon: <Goal size={50} />, // Replace with another relevant Lucide icon
							point: (
								<p className="text-start text-base md:text-xl">
									Provide a description for your second key point. This should
									focus on a specific advantage, such as{' '}
									<span className="font-bold">
										{' '}
										improved performance, efficiency, or satisfaction{' '}
									</span>
									, related to your offering.
								</p>
							),
						},
						{
							icon: <ChartArea size={50} />, // Replace with a different relevant Lucide icon
							point: (
								<p className="text-start text-base md:text-xl">
									Describe the final key benefit or unique selling proposition
									that sets your product apart, ensuring you tie it back to the
									<span className="font-bold">
										{' '}
										customer’s needs and expectations.
									</span>
								</p>
							),
						},
					]}
				/>
			</MarketingSection>
		</main>
	);
}
