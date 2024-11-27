import { FormInput } from '@/components/auth/form-input';
import { Button } from '@/components/ui/button';
import { FormControl, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useParam } from '@/hooks/use-param';
import { zodResolver } from '@hookform/resolvers/zod';
import * as MapboxGL from 'mapbox-gl';
import { useTheme } from 'next-themes';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
//@ts-ignore
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import ReactMapGL, { Marker, NavigationControl } from 'react-map-gl';
//@ts-ignore
import { ViewStateChangeEvent } from 'react-map-gl/src/types/external';
import WebMercatorViewport from 'viewport-mercator-project';
import countries from '@/countries.json';
import * as z from 'zod';

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import { CenteredLoader } from '@/components/layout/centered-loader';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ArrowBigLeft, ArrowLeft, ArrowRight } from 'lucide-react';
import { StoreMapSchema } from '@/schemas';
import useStateDebounce from '@/hooks/useStateDebounce';
import useDidUpdateEffect from '@/hooks/useDidUpdateEffect';
import { getLocation } from '@/actions/store/get-location';
import { StoreResponse } from '@/actions/store/get-stores';
import { StoresFormInputProps } from './stores-form';
import { Store } from '@/db/drizzle/schema/store';
import { StoreGeolocation } from '@/db/drizzle/schema/storeGeolocation';

export type StoreMapInputProps = z.infer<typeof StoreMapSchema>;

interface StoreMapStepProps {
	isEditing?: boolean;
	editingStore?: any | null;
	onSubmit: (values: StoreMapInputProps) => void;
	onBack: () => void;
	isLoading: boolean;
}

const StoreMapStep: React.FC<StoreMapStepProps> = (props) => {
	const $map = useRef<{ getMap(): MapboxGL.Map }>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [showGeolocationData, setShowGeolocationData] = useState(false);

	const form = useForm({
		defaultValues: mapStepDefaultValues(props.editingStore),
		resolver: zodResolver(StoreMapSchema),
	});

	const { formState, setValue, watch, handleSubmit, getValues } = form;

	const getMapZoom = (west?: number, south?: number, east?: number, north?: number) => {
		const map = $map.current?.getMap();

		const { zoom } = new WebMercatorViewport({
			width: map?.getContainer?.()?.clientWidth ?? window.innerWidth,
			height: map?.getContainer?.()?.clientHeight ?? window.innerHeight,
		}).fitBounds(
			[
				[west ?? boundingBox[0][0], south ?? boundingBox[0][1]],
				[east ?? boundingBox[1][0], north ?? boundingBox[1][1]],
			],
			{
				padding: 20,
				offset: [0, 0],
			}
		);

		return zoom;
	};

	const longitude = watch('longitude');
	const latitude = watch('latitude');
	const zoom = watch('zoom') ?? 20;
	const boundingBox = watch('boundingBox');

	const [viewport, setViewport] = useState({
		longitude,
		latitude,
		zoom,
	});

	const searchParams = useSearchParams();
	const [geolocation, setGeolocation] = useState<any>(
		!!watch()?.address?.name?.length ? watch() : null
	);

	const router = useRouter();

	const initialised = useRef(false);

	const { mutateParam } = useParam();

	const [query, setQuery] = useStateDebounce<string>(
		(searchParams.get('location') as string | undefined) ??
			geolocation?.address.label ??
			props.editingStore?.address?.addressName ??
			'',
		300,
		(newQuery) => {
			setQuery(newQuery);
		}
	);

	// // Originate all location searches from London, UK
	const geolocationOriginatingStore = [0.1276, 51.5072];

	const [geolocations, setGeolocations] = useState<any>([]);

	console.log(form.formState.errors, 'form errs');
	useEffect(() => {
		if (!query) return;
		setIsLoading(true);

		(async () => {
			try {
				const data = await getLocation({
					query: query,
					lang: 'en',
					limit: 20,
					at: geolocationOriginatingStore,
					types: ['houseNumber', 'street', 'address', 'postalCode'],
					show: 'streetInfo',
				});

				setGeolocations(data);
			} catch (error) {
				console.error('Failed to fetch geolocation data:', error);
			} finally {
				setIsLoading(false);
			}
		})();
	}, [query]);

	if (geolocation && props.isEditing) {
		initialised.current = true;
	}

	if (!!geolocations?.[0] && !geolocation && !initialised.current) {
		if (!props.isEditing) return (initialised.current = true);

		// mutateParam({ param: 'location', value: geolocations?.[0]?.address?.label ?? '' });

		initialised.current = true;
		setGeolocation(geolocations?.[0] ?? null);
	}

	const handleMapMove = ({
		viewState: { longitude, latitude, zoom, ...rest },
	}: ViewStateChangeEvent) => {
		setValue('longitude', longitude);
		setValue('latitude', latitude);
		setValue('zoom', zoom);

		// Dynamically adjust bounding box to new long/lat based on the absolute unit from the original location
		setValue('boundingBox', [
			[
				longitude -
					Math.abs((geolocation?.position?.lng ?? 0) - (geolocation?.mapView?.west ?? 0)),
				latitude -
					Math.abs(
						(geolocation?.position?.lat ?? 0) - (geolocation?.mapView?.south ?? 0)
					),
			],
			[
				longitude -
					Math.abs((geolocation?.position?.lng ?? 0) - (geolocation?.mapView?.east ?? 0)),
				latitude -
					Math.abs(
						(geolocation?.position?.lat ?? 0) - (geolocation?.mapView?.north ?? 0)
					),
			],
		]);
	};

	useDidUpdateEffect(() => {
		const boundingBox = [
			[
				geolocation?.mapView?.west ??
					props.editingStore?.geolocation?.latitude ??
					geolocation?.position?.lng ??
					0,
				geolocation?.mapView?.south ??
					props.editingStore?.geolocation?.longitude ??
					geolocation?.position?.lat ??
					0,
			],
			[
				geolocation?.mapView?.east ??
					props.editingStore?.geolocation?.latitude ??
					geolocation?.position?.lng ??
					0,
				geolocation?.mapView?.north ??
					props.editingStore?.geolocation?.latitude ??
					geolocation?.position?.lat ??
					0,
			],
		];

		setValue('zoom', zoom ?? watch('zoom') ?? 3);
		setValue('longitude', geolocation?.position?.lng ?? watch('longitude') ?? null);
		setValue('latitude', geolocation?.position?.lat ?? watch('latitude') ?? null);
		setValue('boundingBox', boundingBox ?? watch('boundingBox') ?? null);
	}, [geolocation]);
	const theme = useTheme();

	useDidUpdateEffect(() => {
		setViewport((viewport) => ({
			zoom: zoom ?? 16,
			longitude: longitude ?? 0,
			latitude: latitude ?? 0,
		}));
	}, [longitude, latitude, zoom]);

	async function onSubmit(values: StoreMapInputProps) {
		props.onSubmit(values);
	}

	const [value, setAutocompleteValue] = useState(watch('address.name'));

	const [autocompleteOpen, setAutocompleteOpen] = useState(false);
	const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const pathname = usePathname();

	return (
		<FormProvider {...form}>
			<form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col ">
				{/* <FormControl error={!!formState.errors?.['address']}> */}
				<FormControl>
					<>
						<FormLabel className="flex gap-0.5 mb-2">
							Address <p className="text-destructive">*</p>
						</FormLabel>

						{(initialised.current || !props.isEditing) && (
							<>
								<Command value="" className="mb-4 h-fit max-h-60">
									<Input
										className={`${
											autocompleteOpen
												? 'border-b-0 rounded-bl-none rounded-br-none'
												: ''
										}`}
										value={value}
										onChange={(e) => {
											setAutocompleteValue(e.target.value);
											setAutocompleteOpen(true);

											// Clear the previous timeout if it exists
											if (debounceTimeoutRef.current) {
												clearTimeout(debounceTimeoutRef.current);
											}

											// Set a new timeout
											debounceTimeoutRef.current = setTimeout(async () => {
												router.push(`
												${pathname}?location=${!!e.target.value?.length ? e.target.value : ''}
												`);
											}, 500);
										}}
										placeholder="Search an address..."
									/>
									<CommandList className="">
										{autocompleteOpen ? (
											<>
												{isLoading ? (
													<div className="py-4">
														<CenteredLoader />
													</div>
												) : (
													<CommandEmpty>
														{' '}
														No addresses found.
													</CommandEmpty>
												)}
												<CommandGroup className="">
													{geolocations?.map?.((geolocation: any) => (
														<CommandItem
															key={geolocation.id}
															value={geolocation?.title}
															onSelect={(currentValue) => {
																setAutocompleteValue(
																	currentValue === value
																		? ''
																		: currentValue
																);

																const country = countries?.find(
																	({ name }) =>
																		name ===
																		geolocation?.address
																			?.countryName
																);

																setValue(
																	'address.name',
																	geolocation?.address?.label ??
																		geolocation?.title ??
																		''
																);
																setValue(
																	'address.lineOne',
																	geolocation?.resultType ===
																		'place'
																		? geolocation?.title
																		: geolocation?.resultType ===
																		  'houseNumber'
																		? geolocation?.address?.label?.split(
																				', '
																		  )?.[0] ?? ''
																		: geolocation?.address
																				?.street ?? ''
																);
																setValue(
																	'address.lineTwo',
																	geolocation?.address
																		?.district || ''
																);
																setValue(
																	'address.city',
																	geolocation?.address?.city ?? ''
																);
																setValue(
																	'address.country',
																	country?.name ??
																		geolocation?.address
																			?.countryName ??
																		''
																);
																setValue(
																	'address.postCode',
																	geolocation?.address
																		?.postalCode ?? ''
																);
																setValue(
																	'address.county',
																	`${
																		geolocation?.address?.county
																			? `${
																					geolocation
																						?.address
																						?.county
																			  }${
																					geolocation
																						?.address
																						?.state
																						? ', '
																						: ''
																			  }`
																			: ''
																	}${
																		geolocation?.address
																			?.state ?? ''
																	}`
																);
																setValue(
																	'address.type',
																	geolocation?.resultType ?? ''
																);
																setGeolocation(geolocation);
																setAutocompleteOpen(false);
															}}
														>
															{geolocation?.title}
														</CommandItem>
													))}
												</CommandGroup>
											</>
										) : null}
									</CommandList>
								</Command>
							</>
						)}
					</>
				</FormControl>

				{(!!geolocation || !!props.editingStore?.address?.name?.length) && (
					<div className="flex flex-col gap-2 [&_.mapboxgl-control-container]:hidden  ">
						<p>Drag or zoom in the map to the correct position if required.</p>
						<ReactMapGL
							ref={$map as any}
							mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
							{...viewport}
							zoom={viewport.zoom ?? 20}
							onZoom={handleMapMove}
							onMove={handleMapMove}
							maxZoom={20}
							style={{
								width: '100%',
								height: 'clamp(250px, 400px, 400px)',
								borderRadius: '8px',
								flexShrink: 0,
							}}
							mapStyle={
								theme.theme === 'dark'
									? 'mapbox://styles/mapbox/dark-v11?optimize=true'
									: 'mapbox://styles/mapbox/light-v10?optimize=true'
							}
						>
							<Marker
								className="absolute top-0 "
								longitude={viewport.longitude}
								latitude={viewport.latitude}
								anchor="bottom"
							>
								<div className="w-[100px] h-[100px] relative ">
									<div className="absolute top-1/2 w-[140px] h-[140px]">
										<div className="relative w-full h-full">
											<div className="bg-primary/80 w-[140px] h-[140px] rounded-full opacity-20" />
											<div className="bg-primary -translate-x-1/2 -translate-y-1/2 z-20  left-1/2 top-1/2 absolute rounded-full w-[7px] h-[7px]" />
										</div>
									</div>
								</div>
							</Marker>
						</ReactMapGL>
					</div>
				)}

				{!!geolocation && !showGeolocationData && (
					<Button
						className="z-40 relative"
						variant="link"
						onClick={() => setShowGeolocationData(true)}
					>
						Edit geolocation data
					</Button>
				)}

				{showGeolocationData && (
					<div className="bg-card p-4 z-40 relative">
						<div className="flex flex-col gap-4">
							<div className="flex flex-col gap-2">
								<p className="text-lg">Geolocation data</p>
								<p>
									Edit this data if you have the longitude and latitude of your
									exact location.
								</p>
							</div>

							<p className="text-sm">
								Bounding box: (west {(boundingBox?.[0]?.[0] ?? 0).toFixed(6)}, north{' '}
								{(boundingBox?.[0]?.[1] ?? 0).toFixed(6)}, east{' '}
								{(boundingBox?.[1]?.[0] ?? 0).toFixed(6)}, south{' '}
								{(boundingBox?.[1]?.[1] ?? 0).toFixed(6)})
							</p>
						</div>

						<FormInput
							name="longitude"
							label="Longitude"
							render={({ field }) => <Input {...field} placeholder="John Doe" />}
						/>

						<FormInput
							name="latitude"
							label="Latitude"
							render={({ field }) => <Input {...field} />}
						/>
					</div>
				)}
				<div className="!mt-auto">
					<div className="flex gap-4 md:gap-20 !mt-4">
						<Button
							variant="outline"
							onClick={props.onBack}
							className="w-fit mt-auto z-40 relative"
							isLoading={props.isLoading}
						>
							<ArrowLeft size={20} className="mr-2" />
							back
						</Button>
						<Button
							onClick={form.handleSubmit(onSubmit)}
							className="w-full mt-auto  z-40 relative"
							isLoading={props.isLoading}
							disabled={props.isLoading || !geolocation}
						>
							Next
							<ArrowRight size={20} className="ml-2" />
						</Button>
					</div>
				</div>
			</form>
		</FormProvider>
	);
};

export default StoreMapStep;

export const mapStepDefaultValues = (store?: Store & { address: StoreGeolocation }) => {
	const methods = useFormContext<StoreMapInputProps>();
	const { getValues } = methods || {};

	console.log(store, 'store data');
	return {
		address: {
			name: getValues?.('address.name') ?? store?.address?.addressName ?? '',
			lineOne: getValues?.('address.lineOne') ?? store?.address?.addressLineOne ?? '',
			lineTwo: getValues?.('address.lineTwo') ?? store?.address?.addressLineTwo ?? '',
			city: getValues?.('address.city') ?? store?.address?.city ?? '',
			county: getValues?.('address.county') ?? store?.address?.county ?? '',
			country: getValues?.('address.country') ?? store?.address?.country ?? '',
			postCode: getValues?.('address.postCode') ?? store?.address?.postCode ?? '',
			type: getValues?.('address.type') ?? store?.address?.addressType ?? '',
		},
		longitude: getValues?.('longitude') ?? store?.address?.longitude ?? 51.5072,
		latitude: getValues?.('latitude') ?? store?.address?.latitude ?? 0.1276,
		zoom: getValues?.('zoom') ?? store?.address?.zoom ?? 16,
		boundingBox: getValues?.('boundingBox') ??
			store?.address?.boundingBox ?? [
				[51.5072, 0.1276],
				[51.5072, 0.1276],
			],
	};
};
