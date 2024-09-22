'use client';
import { CodeBlock } from '@/components/code-block';
import Image from 'next/image';
import { Documentation } from '@/components/docs/documentation';
import { DocumentationSection } from '@/components/docs/documentation-section';
import { DocumentationTypography } from '@/components/docs/documentation-typography';

export default function Docs() {
	return (
		<>
			<Documentation>
				<DocumentationSection id="introduction">
					<DocumentationTypography variant="h1">Introduction</DocumentationTypography>

					<DocumentationTypography variant="p">
						Welcome to Project Name.
					</DocumentationTypography>

					<Image
						src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
						alt="NextJS SaaS Boilerplate"
						width={1000}
						height={1000}
						className="object-cover w-full h-[400px] mt-4"
					/>
				</DocumentationSection>

				<DocumentationSection id="quick-start">
					<DocumentationTypography variant="h2">Quick start</DocumentationTypography>
					<DocumentationTypography variant="p">
						To get started with Project Name, follow the steps below:
					</DocumentationTypography>

					<ol className="mt-4 list-none flex flex-col gap-6">
						<li>
							<DocumentationTypography variant="p">
								Step 1: Clone the repository
							</DocumentationTypography>
							<CodeBlock code={'git clone'} language="javascript" />
						</li>
						<li>
							<DocumentationTypography variant="p">
								Step 2: Install dependencies
							</DocumentationTypography>
							<CodeBlock code={'npm install'} language="javascript" />
						</li>
						<li>
							<DocumentationTypography variant="p">
								Step 3: Start the development server
							</DocumentationTypography>
							<CodeBlock code={'npm run dev'} language="javascript" />
						</li>
					</ol>
				</DocumentationSection>
			</Documentation>
		</>
	);
}
