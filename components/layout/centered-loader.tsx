import { ClipLoader } from 'react-spinners';

export function CenteredLoader() {
	return (
		<section className="w-full h-full items-center justify-center flex">
			<ClipLoader className="m-auto" size={50} />
		</section>
	);
}
