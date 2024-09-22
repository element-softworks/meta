'use client';
import { CodeBlock } from '@/components/code-block';
import { Documentation } from '@/components/docs/documentation';
import { DocumentationSection } from '@/components/docs/documentation-section';
import { DocumentationTypography } from '@/components/docs/documentation-typography';

export default function Docs() {
	return (
		<>
			<Documentation>
				<DocumentationSection id="overview">
					<DocumentationTypography variant="h1">
						Documentation overview
					</DocumentationTypography>
					<DocumentationTypography variant="p">
						Creating documentation is easy with the components provided in this
						boilerplate. This has been created this way to ensure that the documentation
						is kept consistent and easy to read.
					</DocumentationTypography>
					<DocumentationTypography variant="p">
						You can use the following components to create your documentation:
					</DocumentationTypography>
					<CodeBlock language="javascript" code={documentationOverviewCode} />
					<DocumentationTypography variant="p">
						Advanced details on code blocks can be found{' '}
						<a className="text-blue-500 font-bold" href="#code-blocks">
							here
						</a>
						.
					</DocumentationTypography>

					<DocumentationTypography variant="h2">Props</DocumentationTypography>
					<DocumentationTypography variant="p">
						The following are the props for the documentation components:
					</DocumentationTypography>
					<CodeBlock language="javascript" code={documentationOverviewProps} />
					<DocumentationTypography variant="h2">Example usage</DocumentationTypography>
					<DocumentationTypography variant="p">
						Below is an example of how you can use the documentation components to
						create documentation.
					</DocumentationTypography>
					<CodeBlock language="javascript" code={documentationOverviewExample} />
				</DocumentationSection>

				<DocumentationSection id="docs-sidebar">
					<DocumentationTypography variant="h2">Sidebar</DocumentationTypography>
					<DocumentationTypography variant="p">
						The sidebar is formed within the DocsSidebar component. To add a new section
						to the sidebar, simply add a group or item to the{' '}
						<span className="bg-muted font-medium">SIDEBAR_ITEMS</span> array. Link this
						new item to a corresponding documentation section ID.
					</DocumentationTypography>
					<DocumentationTypography variant="h3">Example</DocumentationTypography>
					<CodeBlock language="javascript" code={docsSidebarExample} />
				</DocumentationSection>

				<DocumentationSection id="code-blocks">
					<DocumentationTypography variant="h2">Code blocks</DocumentationTypography>
					<DocumentationTypography variant="p">
						To display code blocks, use the following component:
					</DocumentationTypography>

					<DocumentationTypography variant="h2">Props</DocumentationTypography>
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

					<DocumentationTypography variant="h2">Basic example</DocumentationTypography>
					<CodeBlock code={code} language="javascript" enableLineNumbers />
					<DocumentationTypography variant="h4">Expected output</DocumentationTypography>
					<CodeBlock code={codeOutput} language="javascript" />
					<DocumentationTypography variant="h3">
						Advanced use cases
					</DocumentationTypography>
					<DocumentationTypography variant="p">
						For more advanced use cases you may need to create a custom CodeBlock
						component, see the following link for more information:{' '}
						<a
							className="text-blue-500"
							href="https://react-code-block.netlify.app/"
							target="_blank"
							rel="noopener noreferrer"
						>
							https://react-code-block.netlify.app/
						</a>
					</DocumentationTypography>
				</DocumentationSection>
			</Documentation>
		</>
	);
}

const docsSidebarExample = `
//Import the DocsSidebar component
	const SIDEBAR_ITEMS = [
		{
			name: 'New section',
			items: [
				{
					text: 'Overview',
					link: '/docs/new-section#overview',
					icon: <AppWindowMac size={20} />,
					visible: true,
				},
			],
		},
	];
`;

const documentationOverviewProps = `
//Documentation component
interface DocumentationProps {
	children: React.ReactNode;
}

//DocumentationSection component
interface DocumentationSectionProps {
	id: string;
	children: React.ReactNode;
}

//DocumentationTypography component
interface DocumentationTypographyProps {
	variant: 'h1' | 'h2' | 'h3' | 'h4' | 'p';
	children: React.ReactNode;
}

//CodeBlock component
interface CodeBlockProps {
	code: string;
	language: string;
	enableLineNumbers?: boolean;
}
`;

const documentationOverviewExample = `
import { Documentation } from '@/components/docs/documentation'; 
import { DocumentationSection } from '@/components/docs/documentation-section';
import { DocumentationTypography } from '@/components/docs/documentation-typography'; 

//Rest of the code
<Documentation>
	<DocumentationSection id="overview">
		<DocumentationTypography variant="h1">
			Documentation overview
		</DocumentationTypography>
		<DocumentationTypography variant="p">
	</DocumentationSection>
</Documentation>
`;

const documentationOverviewCode = `
//Import the Documentation component as a wrapper for your documentation page
import { Documentation } from '@/components/docs/documentation';

//Import the DocumentationSection component to create sections in your documentation
import { DocumentationSection } from '@/components/docs/documentation-section';

//Import the DocumentationTypography component to create headings and paragraphs in 
//your documentation
import { DocumentationTypography } from '@/components/docs/documentation-typography';

//Import the CodeBlock component to display code blocks in your documentation
import { CodeBlock } from '@/components/code-block';
`;

const code = `
import { CodeBlock } from '@/components/code-block';


//Rest of the code
<CodeBlock code={code} language="javascript" />

const code = \u0060
async function sayHello(name) {
	console.log('Hello', name);
}
\u0060;
`;

const codeOutput = `
async function sayHello(name) {
	console.log('Hello', name);
}
`;
