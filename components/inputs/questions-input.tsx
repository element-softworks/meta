import { QuestionResponse, getQuestions } from '@/actions/question-and-answers/get-questions';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FieldValues, Path, useFieldArray, useFormContext } from 'react-hook-form';
import { PoliciesFormInputProps } from '../policies/policies-form';
import { Badge } from '../ui/badge';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '../ui/command';
import { FormLabel, FormMessage } from '../ui/form';
import { Separator } from '../ui/separator';

type QuestionsInputProps<T extends FieldValues> = {
	name: Path<T>;
	label?: string;
	placeholder?: string;
	onChange?: (value: string) => void;
};

export function QuestionsInput<T extends FieldValues>(props: QuestionsInputProps<T>) {
	const { watch, control } = useFormContext<PoliciesFormInputProps>();
	const [questions, setQuestions] = useState<QuestionResponse['questions']>([]);
	const [value, setAutocompleteValue] = useState('');
	const [autocompleteOpen, setAutocompleteOpen] = useState(false);

	const {
		formState: { errors },
	} = useFormContext<PoliciesFormInputProps>();

	const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
		control,
		name: props.name as 'questions',
	});

	const error = errors[props.name as 'questions']?.message;

	useEffect(() => {
		(async () => {
			console.log('questions response data searching... 2');

			const questionsResponse = (await getQuestions(
				100,
				1,
				value ?? '',
				false
			)) as QuestionResponse;

			console.log(questionsResponse, 'questions response data');
			setQuestions(questionsResponse?.questions);
		})();
	}, [value, autocompleteOpen]);

	const questionsData = watch('questions');
	const filteredQuestions = questions?.filter((question) => {
		return !questionsData?.some((questionData) => questionData.id === question?.id);
	});

	return (
		<div className="relative">
			{!!autocompleteOpen && (
				<div
					className="w-full h-screen fixed top-0 left-0  z-50"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						setAutocompleteOpen(false);
					}}
				></div>
			)}
			<FormLabel className={`flex gap-0.5 mb-2 ${!!error ? 'text-destructive' : ''}`}>
				Questions <p className="text-destructive">*</p>
			</FormLabel>
			<Command className={`bg-card h-fit ${!!error ? '' : 'mb-4'}`}>
				<CommandInput
					onClick={() => {
						setAutocompleteOpen((prev) => !prev);
					}}
					value={value}
					onValueChange={(search) => {
						setAutocompleteValue(search);
						setAutocompleteOpen(true);
					}}
					placeholder="Search questions..."
				/>
				<CommandList
					className={`z-[60] bg-card w-full ${
						autocompleteOpen ? 'block absolute top-16 left-0' : 'hidden'
					}`}
				>
					{autocompleteOpen ? (
						<>
							<CommandEmpty> No questions found.</CommandEmpty>
							<CommandGroup>
								{filteredQuestions?.map?.((question, index) => (
									<CommandItem
										className="cursor-pointer flex flex-col text-start items-start"
										key={index}
										onSelect={(currentValue) => {
											append({
												id: question?.id,
												label: question?.questionText,
											});

											setAutocompleteValue('');
											setAutocompleteOpen(false);
										}}
									>
										<div className="flex flex-row gap-2 items-center">
											<div className="flex flex-col">
												<p>{question?.questionText}</p>
											</div>
										</div>
										<Separator />
									</CommandItem>
								))}
							</CommandGroup>
						</>
					) : null}
				</CommandList>
			</Command>
			<FormMessage className="mb-4 text-destructive">{error}</FormMessage>

			<div className="flex gap-2 flex-wrap overflow-hidden ">
				{fields?.map?.((field, index) => {
					return (
						<Badge
							onClick={() => remove(index)}
							variant="outline"
							className=" group/badge cursor-pointer hover:bg-destructive/10 max-w-full overflow-ellipsis"
							key={index}
						>
							{field.label}{' '}
							<X
								className="border min-w-4 min-h-4 ml-2 bg-border cursor-pointer group-hover/badge:bg-destructive/20 transition-all group-hover/badge:border-destructive/10 -mr-1 rounded-lg"
								size={18}
							/>
						</Badge>
					);
				})}
			</div>
		</div>
	);
}
