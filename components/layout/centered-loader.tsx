import { ClipLoader } from 'react-spinners';

export function CenteredLoader() {
	return (
		<section className="w-full h-full items-center justify-center flex">
			<ClipLoader
				className="m-auto !border-t-primary !border-r-primary !border-l-primary"
				size={50}
			/>
		</section>
	);
}
