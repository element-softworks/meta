'use client';

import { useMutation } from '@/hooks/use-mutation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as z from 'zod';

import { revalidateData } from '@/actions/system/revalidatePath';
import { toast } from '@/components/ui/use-toast';
import { Question } from '@/db/drizzle/schema/question';
import { Store } from '@/db/drizzle/schema/store';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Combobox } from '../ui/combobox';
import { Form } from '../ui/form';
import { StoresInput } from '../inputs/stores-input';
import { PoliciesSchema } from '@/schemas';
import { FormInput } from '../auth/form-input';
import { Input } from '../ui/input';
import { QuestionsInput } from '../inputs/questions-input';

export type PoliciesFormInputProps = z.infer<typeof PoliciesSchema>;

type PoliciesResponse = {
	store: any;
};

interface PoliciesFormProps {
	isEditing?: boolean;
	editingStore?: Store | null;
	onComplete?: () => void;
}

export function PoliciesForm(props: PoliciesFormProps) {
	const { update } = useSession();
	const router = useRouter();

	const defaultStore = props.isEditing ? props.editingStore : null;

	const form = useForm<PoliciesFormInputProps>({
		resolver: zodResolver(PoliciesSchema),
		defaultValues: {
			stores: [],
		},
	});

	const { query: createStoreQuery, isLoading: isCreating } = useMutation<
		FormData,
		PoliciesResponse
	>({
		queryFn: async (values) => {
			return await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/store`, {
				method: 'POST',
				body: values,
			}).then((res) => res.json());
		},

		onCompleted: async (data) => {
			form.reset();
			router.push('/dashboard/stores');
			await revalidateData('/dashboard/stores');
		},
	});

	const { query: updateStoreQuery, isLoading: isUpdating } = useMutation<
		FormData,
		PoliciesResponse
	>({
		queryFn: async (values) => {
			return await fetch(
				`${process.env.NEXT_PUBLIC_APP_URL}/api/store?storeId=${props.editingStore?.id}`,
				{
					method: 'PUT',
					body: values,
				}
			).then((res) => res.json());
		},
		onCompleted: async (data) => {
			form.reset();

			router.push(`/dashboard/stores/${props.editingStore?.id}`);
			await revalidateData(`/dashboard/stores/${props.editingStore?.id}`);
		},
	});

	const onSubmit: SubmitHandler<PoliciesFormInputProps> = async (body) => {
		if (props.isEditing) {
			toast({
				description: 'Editing policy...',
				variant: 'default',
			});

			await updateStoreQuery();
			props.onComplete?.();
		} else {
			toast({
				description: 'Creating policy...',
				variant: 'default',
			});

			const newLocation = await createStoreQuery();
			props.onComplete?.();
		}
	};

	console.log(form.formState.errors, 'errors data');

	return (
		<div className="h-full flex flex-col ">
			<Form {...form}>
				<form className="h-full flex flex-col gap-4 ">
					<FormInput
						name="name"
						label="Name"
						render={({ field }) => (
							<Input
								{...field}
								disabled={isCreating}
								placeholder="United Kingdom stores"
							/>
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
