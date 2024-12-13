'use client';

import { FixtureType } from '@/db/drizzle/schema/fixtureType';
import Image from 'next/image';
import { RichTextRenderer } from '../general/rich-text-renderer';
import { ArchiveFixtureTypeAction } from './archive-fixture-type-action';
import { UpdateFixtureTypeAction } from './update-fixture-type-action';
import { FixtureTypesResponse } from '@/actions/fixture-type/get-fixture-types';

interface FixtureTypeCardProps {
	fixtureType: FixtureTypesResponse['fixtureTypes'][0];
}

export function FixtureTypeCard(props: FixtureTypeCardProps) {
	return (
		<div className="border p-6 rounded-lg relative w-fit flex flex-col gap-4 min-w-60">
			<div className="flex flex-row items-center gap-4">
				<div className="flex flex-row gap-1 items-center flex-1">
					<p className="text-xl font-medium">{props.fixtureType?.fixtureType?.name}</p>
					<p className="font-medium text-muted-foreground">
						{props.fixtureType?.category?.name}
					</p>
				</div>
				<div className="flex flex-row gap-2 ">
					<ArchiveFixtureTypeAction fixtureType={props.fixtureType?.fixtureType} />
					<UpdateFixtureTypeAction fixtureType={props.fixtureType} />
				</div>
			</div>
			{props?.fixtureType?.fixtureType?.images?.map?.((image, index) => {
				return (
					<Image
						key={index}
						src={image}
						alt={props.fixtureType?.fixtureType?.name}
						width={300}
						height={300}
						className="w-auto h-72 mx-auto rounded-lg object-contain"
					/>
				);
			})}

			<RichTextRenderer content={props.fixtureType?.fixtureType?.description} />
		</div>
	);
}
