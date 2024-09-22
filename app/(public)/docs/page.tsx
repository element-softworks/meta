'use client';
import { CodeBlock } from '@/components/code-block';
import Image from 'next/image';

export default function Docs() {
	return (
		<main className="flex h-full flex-col mt-8 md:mt-0 max-w-4xl scroll-smooth">
			<section id="introduction">
				<h1 className="text-3xl md:text-4xl font-bold">Introduction</h1>

				<p className="mt-6 ">Welcome to Project Name.</p>

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
				<p className="mt-4">To get started with Project Name, follow the steps below:</p>

				<ol className="mt-4 list-none flex flex-col gap-6">
					<li>
						<p>Step 1: Clone the repository</p>
						<CodeBlock code={'git clone'} language="javascript" />
					</li>
					<li>
						<p>Step 2: Install dependencies</p>
						<CodeBlock code={'npm install'} language="javascript" />
					</li>
					<li>
						<p>Step 3: Start the development server</p>
						<CodeBlock code={'npm run dev'} language="javascript" />
					</li>
				</ol>
			</section>

			<section id="code-blocks">
				<h2 className="text-2xl md:text-3xl font-semibold mt-8">Code blocks</h2>
				<p className="mt-4 mb-4">To display code blocks, use the following component:</p>

				<h3 className="text-xl font-semibold mb-2">Props</h3>
				<CodeBlock
					code={`
interface CodeBlockProps {
code: string; // The code to display, this is a string of code
language: string; // The language of the code, e.g. javascript, typescript, etc.
enableLineNumbers?: boolean; // Enable line numbers for the code block
}
				`}
					language="javascript"
				/>

				<h3 className="text-xl font-semibold mb-2 mt-4">Basic example</h3>
				<CodeBlock code={code} language="javascript" enableLineNumbers />

				<h3 className="text-xl font-semibold mb-2 mt-4">Advanced use cases</h3>
				<p>
					For more advanced use cases you may need to create a custom CodeBlock component,
					see the following link for more information:{' '}
					<a
						className="text-blue-500"
						href="https://react-code-block.netlify.app/"
						target="_blank"
						rel="noopener noreferrer"
					>
						https://react-code-block.netlify.app/
					</a>
				</p>
			</section>
		</main>
	);
}

const code = `
import { CodeBlock } from '@/components/code-block';

<CodeBlock code={code} language="javascript" />

const code = \u0060
async function sayHello(name) {
	console.log('Hello', name);
}
\u0060;
`;
