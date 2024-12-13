'use client';
import './styles.scss';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useFormContext } from 'react-hook-form';
import { FormInput } from '../../auth/form-input';
import CharacterCount from '@tiptap/extension-character-count';
import Highlight from '@tiptap/extension-highlight';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import MenuBar from './menu-bar';
import Placeholder from '@tiptap/extension-placeholder';

interface RichTextInputProps {
	name: string;
	label?: string;
}
export function RichTextInput(props: RichTextInputProps) {
	const {
		watch,
		setValue,
		formState: { errors },
	} = useFormContext();

	const error = errors[props.name];

	const editor = useEditor({
		extensions: [
			StarterKit.configure(),
			Highlight,
			TaskList,
			TaskItem,
			CharacterCount.configure({
				textCounter: (text) => Number(text.replace(/\s/g, '').length),
				limit: 10000,
			}),
			Placeholder.configure({
				placeholder: 'Write something …',
			}),
		],

		onUpdate({ editor }) {
			setValue(props.name, editor.getHTML());
		},
	});

	return (
		<div>
			<FormInput
				name={props.name}
				label={props.label}
				render={({ field }) => (
					<div className="relative">
						{editor && <MenuBar editor={editor} />}

						<EditorContent
							className="tiptap editor__content border rounded-md bg-card rounded-tr-none rounded-tl-none border-t-0 [&>div]:min-h-32 [&>div]:p-2"
							editor={editor}
						/>
					</div>
				)}
			/>
		</div>
	);
}
