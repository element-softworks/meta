import { Social } from '@/components/auth/social';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export async function generateMetadata() {
	return {
		title: `Error | Login | NextJS SaaS Boilerplate`,
		description: 'Failed logging in to your account on NextJS SaaS Boilerplate.',
		openGraph: {
			title: `Error | Login | NextJS SaaS Boilerplate`,
			description: 'Failed logging in to your account on NextJS SaaS Boilerplate.',
		},
		twitter: {
			title: `Error | Login | NextJS SaaS Boilerplate`,
			description: 'Failed logging in to your account on NextJS SaaS Boilerplate.',
		},
		alternates: {
			canonical: `${process.env.NEXT_PUBLIC_APP_URL}/auth/error`,
		},
	};
}

export default function AuthErrorPage() {
	return (
		<div className="flex flex-col gap-4 max-w-full md:w-[400px]">
			<div className="mb-4 ">
				<h1 className="text-2xl font-semibold tracking-tight">Failed logging in</h1>
				<p className="text-sm text-muted-foreground">
					There was a problem while logging in. Your account may have been archived.
					Contact an administator for help if this continues
				</p>
			</div>
			<Link href="/auth/login">
				<Button isLoading={false} className="w-full mt-2">
					Back to login
				</Button>
			</Link>

			<div className="relative mt-2">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t"></span>
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-background px-2 text-muted-foreground">
						Or continue with
					</span>
				</div>
			</div>
			<Social className="mt-2" />

			<p className="px-8 text-center text-sm text-muted-foreground">
				Already have an account?{' '}
				<Button asChild variant="link" className="px-0 text-muted-foreground">
					<Link href="/auth/login">Login now</Link>
				</Button>
			</p>
		</div>
	);
}
