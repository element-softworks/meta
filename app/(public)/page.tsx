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
import { redirect } from 'next/navigation';

export async function generateMetadata() {
	return {
		title: `Coaching Hours`,
		description:
			'Coaching Hours is a modern boilerplate for building SaaS applications quickly.',
		openGraph: {
			title: `Coaching Hours`,
			description:
				'Coaching Hours is a modern boilerplate for building SaaS applications quickly.',
		},
		twitter: {
			title: `Coaching Hours`,
			description:
				'Coaching Hours is a modern boilerplate for building SaaS applications quickly.',
		},
		alternates: {
			canonical: `${process.env.NEXT_PUBLIC_APP_URL}`,
		},
	};
}

export default function Home() {
	redirect('/auth/login');
}
