import { AuthLayoutButton } from '@/components/auth/auth-layout-button';
import { FrameIcon } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { ClipLoader } from 'react-spinners';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	const randomBackgroundImageIndex = Math.floor(Math.random() * 6) + 1;

	return (
		<main className="auth-layout h-screen max-w-full">
			<section className="flex flex-col md:flex-row min-h-screen ">
				<section className="min-h-screen flex-1 justify-center-center">
					<AuthLayoutButton />
					<div className="justify-center items-center flex flex-col min-h-screen mb-auto p-4 md:p-8">
						<Suspense fallback={<ClipLoader size={50} />}>{children}</Suspense>
					</div>
				</section>
				<aside className="md:flex hidden flex-col w-1/2 bg-zinc-900  flex-0 md:flex-1 relative text-white p-8">
					<div
						style={{
							backgroundImage: `url('/images/auth/auth-layout-image-${randomBackgroundImageIndex}.webp')`,
						}}
						className={` opacity-10 w-full h-full absolute z-0 bg-cover -m-8`}
					/>
					<Link
						href="/"
						className="z-20 absolute md:flex items-center text-lg font-light hidden top-4 md:top-8 left-4 md:left-8"
					>
						<FrameIcon className="mr-2" size={30} />
						<p className="hidden md:block">NextJS SaaS Boilerplate</p>
					</Link>
					<div className="z-10 relative md:flex items-center justify-center flex-1 hidden">
						<div className="text-start">
							<p className="text-3xl font-semibold tracking-tight">Welcome</p>
						</div>
					</div>
					<blockquote className="space-y-2">
						<p className="md:text-md lg:text-lg">
							“This software has revolutionized the way I manage my projects,
							streamlining my workflow and allowing me to exceed client expectations
							every time.”
						</p>
						<footer className="md:text-xs lg:text-sm">Nathan Carter</footer>
					</blockquote>
				</aside>
			</section>
		</main>
	);
}
