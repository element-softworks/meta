'use client';
import { Button } from '@/components/ui/button';
import { FrameIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	const location = usePathname();

	const isLogin = location === '/auth/login';

	const AuthButton = isLogin ? (
		<Button variant="ghost" className="top-4 md:top-8 left-4 md:left-8 absolute py-0">
			<Link href={'/auth/register'}>Register</Link>
		</Button>
	) : (
		<Button variant="ghost" className="top-4 md:top-8 left-4 md:left-8 absolute py-0">
			<Link href="/auth/login">Login</Link>
		</Button>
	);

	const randomBackgroundImageIndex = Math.floor(Math.random() * 6) + 1;

	console.log(randomBackgroundImageIndex, 'randomBackgroundImageIndex');
	return (
		<main className="auth-layout h-full max-w-full">
			{AuthButton}

			<section className="flex flex-col md:flex-row  h-full ">
				<section className="h-full justify-center items-center flex p-4 flex-1">
					{children}
				</section>
				<aside className="md:flex hidden flex-col w-1/2 bg-zinc-900  flex-0 md:flex-1 relative text-white p-8">
					<div
						style={{
							backgroundImage: `url('/images/auth/auth-layout-image-${randomBackgroundImageIndex}.webp')`,
						}}
						className={` opacity-10 w-full h-full absolute z-0 bg-cover -m-8`}
					/>
					<div className="z-10 absolute md:flex items-center text-lg font-light hidden top-4 md:top-8 left-4 md:left-8">
						<FrameIcon className="mr-2" size={30} />
						NextJS SaaS Boilerplate
					</div>

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
