import type { Editor } from '@tiptap/react';

import { Fragment } from 'react';
import MenuItem from './menu-item';
import {
	ArrowLeftToLine,
	ArrowUpToLine,
	Bold,
	Code,
	CodeSquare,
	FilterX,
	Heading1,
	Heading2,
	Italic,
	List,
	ListCheck,
	ListOrdered,
	PenLine,
	Quote,
	SeparatorHorizontal,
	Strikethrough,
	WrapText,
} from 'lucide-react';
import { FaListUl, FaParagraph, FaQuoteLeft } from 'react-icons/fa';
import { FcClearFilters } from 'react-icons/fc';

export default function MenuBar({ editor }: { editor: Editor }) {
	const items = [
		{
			icon: <Bold size={16} />,
			title: 'Bold',
			action: () => editor.chain().focus().toggleBold().run(),
			isActive: () => editor.isActive('bold'),
		},
		{
			icon: <Italic size={16} />,
			title: 'Italic',
			action: () => editor.chain().focus().toggleItalic().run(),
			isActive: () => editor.isActive('italic'),
		},
		{
			icon: <Strikethrough size={16} />,
			title: 'Strike',
			action: () => editor.chain().focus().toggleStrike().run(),
			isActive: () => editor.isActive('strike'),
		},
		{
			icon: <Code size={16} />,
			title: 'Code',
			action: () => editor.chain().focus().toggleCode().run(),
			isActive: () => editor.isActive('code'),
		},
		{
			icon: <PenLine size={16} />,
			title: 'Highlight',
			action: () => editor.chain().focus().toggleHighlight().run(),
			isActive: () => editor.isActive('highlight'),
		},
		{
			type: 'divider',
		},
		{
			icon: <Heading1 size={16} />,
			title: 'Heading 1',
			action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
			isActive: () => editor.isActive('heading', { level: 1 }),
		},
		{
			icon: <Heading2 size={16} />,
			title: 'Heading 2',
			action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
			isActive: () => editor.isActive('heading', { level: 2 }),
		},
		{
			icon: <>P</>,
			title: 'Paragraph',
			action: () => editor.chain().focus().setParagraph().run(),
			isActive: () => editor.isActive('paragraph'),
		},
		{
			icon: <List size={16} />,
			title: 'Bullet List',
			action: () => editor.chain().focus().toggleBulletList().run(),
			isActive: () => editor.isActive('bulletList'),
		},
		{
			icon: <ListOrdered size={16} />,
			title: 'Ordered List',
			action: () => editor.chain().focus().toggleOrderedList().run(),
			isActive: () => editor.isActive('orderedList'),
		},
		{
			icon: <ListCheck size={16} />,
			title: 'Task List',
			action: () => editor.chain().focus().toggleTaskList().run(),
			isActive: () => editor.isActive('taskList'),
		},

		{
			type: 'divider',
		},
		{
			icon: <Quote size={16} />,
			title: 'Blockquote',
			action: () => editor.chain().focus().toggleBlockquote().run(),
			isActive: () => editor.isActive('blockquote'),
		},
		{
			icon: <SeparatorHorizontal size={16} />,
			title: 'Horizontal Rule',
			action: () => editor.chain().focus().setHorizontalRule().run(),
		},
		{
			type: 'divider',
		},
		{
			icon: <WrapText size={16} />,
			title: 'Hard Break',
			action: () => editor.chain().focus().setHardBreak().run(),
		},
		{
			icon: <FilterX size={16} />,
			title: 'Clear Format',
			action: () => editor.chain().focus().clearNodes().unsetAllMarks().run(),
		},
		{
			type: 'divider',
		},
		{
			icon: <ArrowLeftToLine size={16} />,
			title: 'Undo',
			action: () => editor.chain().focus().undo().run(),
		},
		{
			icon: <ArrowUpToLine size={16} />,
			title: 'Redo',
			action: () => editor.chain().focus().redo().run(),
		},
	];

	return (
		<div className="editor__header flex flex-row gap-1 flex-wrap border rounded-tr-md rounded-tl-md px-2 py-4 bg-card">
			{items.map((item, index) => (
				<Fragment key={index}>
					{item.type === 'divider' ? (
						<div className="divider border-r" />
					) : (
						<MenuItem {...item} />
					)}
				</Fragment>
			))}
		</div>
	);
}
