import { Logo } from '@/components/general/logo';
import { Footer } from '@/components/marketing/footer';
import { Suspense } from 'react';
import { ClipLoader } from 'react-spinners';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<main className="auth-layout min-h-screen max-w-full">
			<section className="flex flex-col md:flex-row min-h-screen ">
				<section className="min-h-screen bg-primary-foreground flex-1 ">
					<div className=" min-h-screen mb-auto relative max-w-lg mx-auto w-full py-8 px-4 md:px-8 flex flex-col">
						<Logo width={200} height={50} />
						<div className="justify-center items-center flex mx-auto flex-col my-auto w-full">
							<Suspense fallback={<ClipLoader size={50} />}>{children}</Suspense>
						</div>
					</div>
				</section>
				<aside className="md:flex overflow-hidden hidden flex-col w-1/2 bg-background  flex-0 md:flex-1 relative text-white ">
					<div className="z-10 relative md:flex justify-center flex-1 hidden px-4 "></div>
				</aside>
			</section>
			<Footer />
		</main>
	);
}
