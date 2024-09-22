import Image from 'next/image';

export default function Home() {
	return (
		<main className="flex h-full flex-col mt-8 md:mt-0 max-w-4xl scroll-smooth">
			<section id="introduction">
				<h1 className="text-3xl md:text-4xl font-bold">Introduction</h1>

				<p className="mt-6 ">Welcome to Project Name,</p>

				<Image
					src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
					alt="NextJS SaaS Boilerplate"
					width={1000}
					height={1000}
					className="object-cover w-full h-[400px] mt-4"
				/>
			</section>

			<section id="quick-start">
				<h2 className="text-2xl md:text-3xl font-semibold mt-8">Quick start</h2>
				<p className="mt-6">To get started with Project Name, follow the steps below:</p>

				<ol className="mt-4 list-none flex flex-col gap-6">
					<li>
						<p>Step 1: Clone the repository</p>
						<pre className="bg-gray-100 p-2 rounded-md mt-2">git clone</pre>
					</li>
					<li>
						<p>Step 2: Install dependencies</p>
						<pre className="bg-gray-100 p-2 rounded-md mt-2">npm install</pre>
					</li>
					<li>
						<p>Step 3: Start the development server</p>
						<pre className="bg-gray-100 p-2 rounded-md mt-2">npm run dev</pre>
					</li>
				</ol>
			</section>
		</main>
	);
}
