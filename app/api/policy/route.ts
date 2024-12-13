import { archivePolicies } from '@/actions/policy/archive-policies';
import { createPolicy } from '@/actions/policy/create-policy';
import { getPolicies } from '@/actions/policy/get-policies';
import { updatePolicy } from '@/actions/policy/update-policy';
import { formDataToNestedObject } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: Response) {
	const values = await req.formData();

	const parsedValues: any = formDataToNestedObject(values);

	try {
		const response: any = await createPolicy(parsedValues);

		if (!!response?.error) {
			return NextResponse.json({
				error: response?.error ?? 'An error occurred creating the policy.',
			});
		} else {
			return NextResponse.json({ ...response });
		}
	} catch (error: any) {
		return NextResponse.json({ error: error.message });
	}
}

export async function PUT(req: NextRequest, res: Response) {
	const urlParams = new URL(req.url).searchParams;
	const policyId = urlParams.get('policyId') ?? '';

	const values = await req.formData();

	const parsedValues: any = formDataToNestedObject(values);

	try {
		const response: any = await updatePolicy(parsedValues, policyId);

		if (!!response?.error) {
			return NextResponse.json({
				error: response?.error ?? 'An error occurred updating the store.',
			});
		} else {
			return NextResponse.json({ ...response });
		}
	} catch (error: any) {
		return NextResponse.json({ error: error.message });
	}
}

export async function GET(req: NextRequest, res: Response) {
	const { searchParams } = new URL(req.url);
	const perPage = searchParams.get('perPage');
	const pageNum = searchParams.get('pageNum');
	const showArchived = searchParams.get('showArchived');
	const search = searchParams.get('search');

	if (!perPage) {
		return NextResponse.json({
			error: 'perPage is required',
		});
	}
	if (!pageNum) {
		return NextResponse.json({
			error: 'pageNum is required',
		});
	}

	const response = await getPolicies(
		Number(perPage),
		Number(pageNum),
		search ?? undefined,
		showArchived === 'true'
	);

	return NextResponse.json({ success: true, data: response });
}

export async function DELETE(req: NextRequest, res: Response) {
	const { searchParams } = new URL(req.url);
	const policyIds = searchParams.get('policyIds');

	if (!policyIds?.length) {
		return NextResponse.json({
			error: 'policyIds is required',
		});
	}

	const formattedIds = policyIds?.split(',');

	const response = await archivePolicies(formattedIds);

	return NextResponse.json({ ...response });
}
