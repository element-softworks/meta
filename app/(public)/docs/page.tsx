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

					<DocumentationTypography variant="p">
						Documentation is an essential component of any successful project,
						especially when dealing with complex systems like dashboards, developer
						integrations, and specialized use cases. Clear and thorough documentation
						serves as a roadmap, guiding users on how to effectively navigate and
						utilize all the features of the project.
					</DocumentationTypography>

					<DocumentationTypography variant="p">
						For dashboard projects, documentation helps users—from end-users to
						administrators—understand how to configure, customize, and maximize the
						insights provided. When it comes to developer integrations, well-structured
						documentation ensures that external teams can easily integrate their tools
						or services with the platform. It provides clear API references,
						step-by-step guides, and best practices to streamline the integration
						process, reducing the risk of errors and ensuring smoother collaboration.
						For more complex use cases, comprehensive documentation becomes even more
						critical. It empowers users to leverage advanced functionalities without
						having to rely on trial and error, thus improving productivity and reducing
						downtime. Overall, this documentation is designed to help you get started
						with Project Name, whether you{"'"}re an end-user seeking insight or a
						developer integrating custom functionality.
					</DocumentationTypography>
					<Image
						src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
						alt="Coaching Hours"
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

					<ol className="mt-4 list-none flex flex-col gap-4">
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
