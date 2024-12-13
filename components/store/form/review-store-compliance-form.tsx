'use client';

import { useMutation } from '@/hooks/use-mutation';
import { StoresSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form } from '../../ui/form';

import { revalidateData } from '@/actions/system/revalidatePath';
import { Store } from '@/db/drizzle/schema/store';
import { useRouter } from 'next/navigation';
import { PolicyQuestionsResponse } from '@/actions/policy/get-policy-questions';
import { StoreResponse } from '@/actions/store/get-store-by-id';

export type ReviewStoreComplianceInputProps = z.infer<typeof StoresSchema>;

interface ReviewStoreComplianceProps {
	store?: StoreResponse;
	questions?: PolicyQuestionsResponse;
	onComplete?: () => void;
}

export function ReviewStoreComplianceForm(props: ReviewStoreComplianceProps) {
	const { update } = useSession();
	const router = useRouter();

	const form = useForm<ReviewStoreComplianceInputProps>({
		resolver: zodResolver(StoresSchema),
		defaultValues: {},
	});

	const { query: reviewStoreComplianceQuery, isLoading: isReviewing } = useMutation<{}, {}>({
		queryFn: async (values) => {},

		onCompleted: async (data) => {
			form.reset({});
			router.push('/dashboard/stores');
			await revalidateData('/dashboard/stores');
		},
	});

	const onSubmit: SubmitHandler<ReviewStoreComplianceInputProps> = async (body) => {
		await reviewStoreComplianceQuery(body);
	};

	return (
		<div className="h-full flex flex-col ">
			<Form {...form}>
				<form className="h-full flex flex-col ">
					<div className="my-4">
						<p className="font-medium text-xl">Review store compliance</p>
						<p className="text-sm text-muted-foreground">
							Review the store compliance to ensure that the store is following the
							rules and regulations.
						</p>
					</div>

					<div className="space-y-4 h-full">
						{props.questions?.questions?.map?.((question) => {
							return <p>{question?.question?.questionText}</p>;
						})}
					</div>
				</form>
			</Form>
		</div>
	);
}
