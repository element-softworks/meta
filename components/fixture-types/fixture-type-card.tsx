'use client';

import { FixtureType } from '@/db/drizzle/schema/fixtureType';
import Image from 'next/image';
import { RichTextRenderer } from '../general/rich-text-renderer';
import { ArchiveFixtureTypeAction } from './archive-fixture-type-action';
import { UpdateFixtureTypeAction } from './update-fixture-type-action';

interface FixtureTypeCardProps {
	fixtureType: FixtureType;
}

export function FixtureTypeCard(props: FixtureTypeCardProps) {
	return (
		<div className="border p-6 rounded-lg relative w-fit flex flex-col gap-4">
			<div className="flex flex-row gap-2 absolute top-4 right-4">
				<ArchiveFixtureTypeAction fixtureType={props.fixtureType} />
				<UpdateFixtureTypeAction fixtureType={props.fixtureType} />
			</div>
			<p className="text-xl font-medium">{props.fixtureType?.name}</p>

			{props?.fixtureType.images?.map?.((image, index) => {
				return (
					<Image
						key={index}
						src={image}
						alt={props.fixtureType?.name}
						width={300}
						height={300}
						className="w-auto h-72 mx-auto rounded-lg object-contain"
					/>
				);
			})}

			<RichTextRenderer content={props.fixtureType?.description} />
		</div>
	);
}
