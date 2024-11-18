import { CodeBlock } from '@/components/docs/code-block';
import { Documentation } from '@/components/docs/documentation';
import { DocumentationSection } from '@/components/docs/documentation-section';
import { DocumentationTypography } from '@/components/docs/documentation-typography';

export async function generateMetadata() {
	return {
		title: `Creating Docs | Documentation | Coaching Hours`,
		description:
			'View the documentation for creating docs inside of Coaching Hours. Learn how to write documentation for your SaaS project.',
		openGraph: {
			title: `Creating Docs | Documentation | Coaching Hours`,
			description:
				'View the documentation for creating docs inside of Coaching Hours. Learn how to write documentation for your SaaS project.',
		},
		twitter: {
			title: `Creating Docs | Documentation | Coaching Hours`,
			description:
				'View the documentation for creating docs inside of Coaching Hours. Learn how to write documentation for your SaaS project.',
		},
		alternates: {
			canonical: `${process.env.NEXT_PUBLIC_APP_URL}/docs/creating-docs`,
		},
	};
}

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
						<a
							className="text-primary font-semibold underline hover:no-underline"
							href="#code-blocks"
						>
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
					<CodeBlock
						lines={['6:13']}
						enableLineNumbers
						language="javascript"
						code={documentationOverviewExample}
					/>
				</DocumentationSection>

				<DocumentationSection id="docs-sidebar">
					<DocumentationTypography variant="h2">Sidebar</DocumentationTypography>
					<DocumentationTypography variant="p">
						The sidebar is formed within the DocsSidebar component. To add a new section
						to the sidebar, simply add a group or item to the{' '}
						<span className="bg-muted font-medium">SIDEBAR_ITEMS</span> array. Link this
						new item to a corresponding documentation section ID.
					</DocumentationTypography>

					<DocumentationTypography variant="p">
						To create a new category in the sidebar, add a a new group to{' '}
						<span className="bg-muted font-medium">SIDEBAR_ITEMS</span> and link it to a
						newly created page within NextJs router. Below is an example of creating a
						new section which routes to a new subset page of documentation.
					</DocumentationTypography>

					<DocumentationTypography variant="h3">Example</DocumentationTypography>
					<CodeBlock
						lines={['15:25']}
						enableLineNumbers
						language="javascript"
						code={docsSidebarExample}
					/>
				</DocumentationSection>

				<DocumentationSection id="code-blocks">
					<DocumentationTypography variant="h2">Code blocks</DocumentationTypography>
					<DocumentationTypography variant="p">
						Code blocks are used to display code within the documentation. This is
						achieved using the CodeBlock component. To display code blocks, use the
						following component:
					</DocumentationTypography>

					<DocumentationTypography variant="h2">Props</DocumentationTypography>
					<CodeBlock code={codeBlockPropsCode} language="javascript" />

					<DocumentationTypography variant="h2">Basic example</DocumentationTypography>
					<CodeBlock code={code} language="javascript" enableLineNumbers />
					<DocumentationTypography variant="h4">Expected output</DocumentationTypography>
					<CodeBlock code={codeOutput} language="javascript" />
					<DocumentationTypography variant="h3">
						Advanced use cases
					</DocumentationTypography>

					<DocumentationTypography variant="h4">
						Highlighting code
					</DocumentationTypography>
					<DocumentationTypography variant="p">
						To highlight specific lines in the code block, pass an array of line numbers
						to the <span className="bg-muted font-medium">lines</span> prop. The code
						block will then highlight the lines specified. To highlight one line, pass
						type number. To highlight a range of lines, pass type string of format e.g{' '}
						<span className="bg-muted font-medium">2:5</span>.
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

const codeBlockPropsCode = `
interface CodeBlockProps {
code: string; // The code to display, this is a string of code
language: string; // The language of the code, e.g. javascript, typescript, etc.
enableLineNumbers?: boolean; // Enable line numbers for the code block
lines?: (number | string)[]; // Highlight specific lines in the code block
copyToClipboard?: boolean; // Enable copy to clipboard functionality (defaults to true)
}
`;

const docsSidebarExample = `
//Import the DocsSidebar component

	const SIDEBAR_ITEMS = [
		{
			name: 'Getting setup',
			items: [
				{
					text: 'Introduction',
					link: '/docs#introduction',
					icon: <Lightbulb size={20} />,
					visible: true,
				},
			],
		},
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
	id: string; // The id of the section which links to the sidebar # value
	children: React.ReactNode;
}

//DocumentationTypography component
interface DocumentationTypographyProps {
	variant: 'h1' | 'h2' | 'h3' | 'h4' | 'p'; // The variant of the typography component
	children: React.ReactNode;
}

//CodeBlock component
interface CodeBlockProps {
	code: string; // The code to display, this is a string of code
	language: string; // The language of the code, e.g. javascript, typescript, etc.
	enableLineNumbers?: boolean; // Enable line numbers for the code block
	lines?: (number | string)[]; // Highlight specific lines in the code block
	copyToClipboard?: boolean; // Enable copy to clipboard functionality (defaults to true)
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
