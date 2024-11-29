'use client';

import { useMutation } from '@/hooks/use-mutation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as z from 'zod';

import { revalidateData } from '@/actions/system/revalidatePath';
import { toast } from '@/components/ui/use-toast';
import { Question } from '@/db/drizzle/schema/question';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Combobox } from '../ui/combobox';
import { Form } from '../ui/form';
import { PoliciesSchema } from '@/schemas';
import { FormInput } from '../auth/form-input';
import { Input } from '../ui/input';
import { QuestionsInput } from '../inputs/questions-input';
import { Policy } from '@/db/drizzle/schema/policy';
import { createPolicy } from '@/actions/policy/create-policy';
import { StoresInput } from '../inputs/stores-input';
import { PolicyResponse } from '@/actions/policy/get-policy-by-id';
import { updatePolicy } from '@/actions/policy/update-policy';
import { useEffect } from 'react';

export type PoliciesFormInputProps = z.infer<typeof PoliciesSchema>;

type PoliciesResponse = {
	store: any;
};

interface PoliciesFormProps {
	isEditing?: boolean;
	editingPolicy?: PolicyResponse | null;
	onComplete?: () => void;
}

export function PoliciesForm(props: PoliciesFormProps) {
	const { update } = useSession();
	const router = useRouter();

	const defaultPolicy = props.isEditing ? props.editingPolicy : null;

	const form = useForm<PoliciesFormInputProps>({
		resolver: zodResolver(PoliciesSchema),
		defaultValues: {
			name: defaultPolicy?.policy?.name ?? '',
			stores: defaultPolicy?.stores?.map?.((store) => ({
				id: store.id,
				label: store.name,
			})),
			questions: defaultPolicy?.questions?.map?.((question) => ({
				id: question.id,
				label: question.questionText,
			})),
		},
	});

	useEffect(() => {
		form.reset({
			name: props.editingPolicy?.policy?.name ?? '',
			stores: props.editingPolicy?.stores?.map?.((store) => ({
				id: store.id,
				label: store.name,
			})),
			questions: props.editingPolicy?.questions?.map?.((question) => ({
				id: question.id,
				label: question.questionText,
			})),
		});
	}, [props.editingPolicy]);

	const { query: createPolicyQuery, isLoading: isCreating } = useMutation<
		PoliciesFormInputProps,
		PoliciesResponse
	>({
		queryFn: async (values) => {
			return await createPolicy(values!);
		},

		onCompleted: async (data) => {
			form.reset();
			router.push('/dashboard/stores');
			await revalidateData('/dashboard/stores');
		},
	});

	const { query: updatePolicyQuery, isLoading: isUpdating } = useMutation<
		PoliciesFormInputProps,
		PoliciesResponse
	>({
		queryFn: async (values) => {
			return await updatePolicy(values!, props.editingPolicy?.policy?.id ?? '');
		},

		onCompleted: async (data) => {
			form.reset();
			await revalidateData('/dashboard/stores');
		},
	});

	const onSubmit: SubmitHandler<PoliciesFormInputProps> = async (body) => {
		if (props.isEditing) {
			toast({
				description: 'Editing policy...',
				variant: 'default',
			});
			await updatePolicyQuery(body);
			props.onComplete?.();
		} else {
			toast({
				description: 'Creating policy...',
				variant: 'default',
			});

			const newPolicy = await createPolicyQuery(body);
			props.onComplete?.();
		}
	};

	return (
		<div className="h-full flex flex-col ">
			<Form {...form}>
				<form className="h-full flex flex-col gap-4 ">
					<FormInput
						name="name"
						label="Name"
						render={({ field }) => (
							<Input {...field} disabled={isCreating} placeholder="Europe" />
						)}
					/>

					<StoresInput name="stores" label="Select stores for your policy" />
					<QuestionsInput name="questions" label="Select questions for your policy" />

					<Button onClick={form.handleSubmit(onSubmit)} className="mt-auto">
						{props.isEditing ? 'Update' : 'Create'} policy
					</Button>
				</form>
			</Form>
		</div>
	);
}
