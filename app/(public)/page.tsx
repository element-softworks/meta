import { CallToAction } from '@/components/marketing/call-to-action';
import { Contact } from '@/components/marketing/contact';
import { Content } from '@/components/marketing/content';
import { FrequentlyAskedQuestions } from '@/components/marketing/frequently-asked-questions';
import { Header } from '@/components/marketing/header';
import { KeyPointList } from '@/components/marketing/key-point-list';
import { MarketingSection } from '@/components/marketing/marketing-section';
import { MarketingSlider } from '@/components/marketing/marketing-slider';
import { MarqueeText } from '@/components/marketing/marquee-text';
import { ParallaxContent } from '@/components/marketing/parallax-content';
import { Pricing } from '@/components/marketing/pricing';
import { Testimonials } from '@/components/marketing/testimonials';
import { Button } from '@/components/ui/button';
import { DUMMY_FAQS, DUMMY_TESTIMONIALS } from '@/lib/dummy-data';
import plans from '@/plans';
import { ChartArea, Goal, Pointer } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { slug: string } }) {
	return {
		title: `NextJS SaaS Boilerplate`,
		description:
			'NextJS SaaS Boilerplate is a modern boilerplate for building SaaS applications quickly.',
		openGraph: {
			title: `NextJS SaaS Boilerplate`,
			description:
				'NextJS SaaS Boilerplate is a modern boilerplate for building SaaS applications quickly.',
		},
		twitter: {
			title: `NextJS SaaS Boilerplate`,
			description:
				'NextJS SaaS Boilerplate is a modern boilerplate for building SaaS applications quickly.',
		},
		alternates: {
			canonical: `${process.env.NEXT_PUBLIC_APP_URL}`,
		},
	};
}

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
			<MarketingSection
				disablePaddingTop
				disableContainer
				disablePaddingX
				disablePaddingBottom
			>
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

			<MarketingSection className="pt-8 md:pt-16" fadeSides>
				<MarqueeText
					text={['Built using', 'NextJS', 'Shadcn/ui', 'Tailwind css']}
					direction="left"
				/>
				<MarqueeText
					text={['Tailwind css', 'Built using', 'NextJS', 'Shadcn/ui']}
					direction="right"
				/>
			</MarketingSection>

			<MarketingSection disablePaddingTop>
				<KeyPointList
					title="Enter Your Section Title Here"
					subtitle="Provide a brief description here. Summarize the value or key benefits of your product in a few sentences."
					keyPoints={[
						{
							icon: <Pointer className="min-w-10 min-h-10  text-primary" />, // Replace with a relevant Lucide icon, e.g., Target, Rocket, ShieldCheck
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
							icon: <Goal className="min-w-10 min-h-10  text-primary" />, // Replace with another relevant Lucide icon
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
							icon: <ChartArea className="min-w-10 min-h-10  text-primary" />, // Replace with a different relevant Lucide icon
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

			<MarketingSection className="mt-60 md:mt-40">
				<ParallaxContent
					title="Enter a title for this section, such as 'Advanced Analytics'"
					description="Provide a brief description of the content in this section. This could be a feature, benefit, or use case of your product or service."
					image="https://nextjs-saas-boilerplate.s3.us-east-2.amazonaws.com/advanced-analytics.webp"
					imageCover
				/>
			</MarketingSection>

			<MarketingSection disablePaddingTop>
				<ParallaxContent
					title="Enter a title for this section, such as 'User Management'"
					description="Provide a brief description of the content in this section. This could be a feature, benefit, or use case of your product or service."
					image="https://nextjs-saas-boilerplate.s3.us-east-2.amazonaws.com/advanced-analytics.webp"
					imageCover
					actions={
						<Link href="/docs">
							<Button variant="outline" className="w-fit">
								Read the documentation
							</Button>
						</Link>
					}
				/>
			</MarketingSection>

			<MarketingSection disablePaddingTop>
				<ParallaxContent
					title="Enter a title for this section, such as 'Invoice Management'"
					description="Provide a brief description of the content in this section. This could be a feature, benefit, or use case of your product or service."
					image="https://nextjs-saas-boilerplate.s3.us-east-2.amazonaws.com/advanced-analytics.webp"
					imageCover
					actions={
						<Link href="/auth/register">
							<Button className="w-fit">Start your journey today</Button>
						</Link>
					}
				/>
			</MarketingSection>

			<MarketingSection>
				<Testimonials
					title="Loved by users worldwide"
					description="These testimonials are fake, ensure to replace them with real testimonials from your users."
					testimonials={DUMMY_TESTIMONIALS}
				/>
			</MarketingSection>

			<MarketingSection>
				<Content
					title="Enter an intro for your pricing plans"
					description="Provide a brief description of the pricing plans available. This could include the features, benefits, or value of each plan."
					imageCover
					image="https://nextjs-saas-boilerplate.s3.us-east-2.amazonaws.com/advanced-analytics.webp"
				/>
			</MarketingSection>

			<MarketingSection disablePaddingTop id="pricing">
				<Pricing
					title="Write a caption to sell your pricing plans"
					caption="Pricing"
					plans={Object.entries(plans)
						?.filter((p) => p[1].type === 'subscription')
						?.map((plan, index) => ({
							features: plan[1].features.map((feature) => ({
								title: feature.feature,
								active: feature.active,
							})),
							name: plan[1].name,
							popular: index === 1,
							price: (
								<p className="flex gap-2 text-xl items-end">
									<span className="line-through text-xl text-muted-foreground">
										£{(plan[1].price * 1.2).toFixed(0)}
									</span>
									<span className="text-4xl font-bold">£{plan[1].price}</span>{' '}
									<span className="text-sm">GBP</span>
								</p>
							),
						}))}
				/>
			</MarketingSection>

			<MarketingSection fadeSides disablePaddingTop disablePaddingBottom>
				<MarqueeText text={['Start', 'Your', 'Journey', 'Today']} direction="left" />
			</MarketingSection>
			<MarketingSection>
				<CallToAction
					title="Call to action title"
					description="Try and convince your visitors to take action. This could be signing up for a free trial, subscribing to a newsletter, or purchasing your product."
				/>
			</MarketingSection>

			<MarketingSection>
				<FrequentlyAskedQuestions
					title="Frequently asked questions"
					description="Provide answers to common questions about your product or service. This can help address any concerns or uncertainties your visitors may have."
					faqs={DUMMY_FAQS}
				/>
			</MarketingSection>

			<MarketingSection className="border-t-2" id="contact">
				<Contact
					title="Contact us"
					description="Get in touch with us for any queries or feedback."
				/>
			</MarketingSection>
		</main>
	);
}
