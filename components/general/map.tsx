'use client';
import { Button } from '@/components/ui/button';
import * as MapboxGL from 'mapbox-gl';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import ReactMapGL, { Layer, LayerProps, Marker, Source } from 'react-map-gl';
import { FaExpand, FaExpandAlt } from 'react-icons/fa';
//@ts-ignore
import { ViewStateChangeEvent } from 'react-map-gl/src/types/external';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import Link from 'next/link';
import WebMercatorViewport from 'viewport-mercator-project';

interface MapProps {
	clusters?: {
		longitude: number;
		latitude: number;
		id: number;
		name: string;
	}[];
	height?: string;
	children?: React.ReactNode;
	lng?: number;
	lat?: number;
	zoom?: number;
	title?: string;
	description?: string;
	expandable?: boolean;
	directions?: boolean;
	fullscreen?: boolean;
	onMapMove?: (data: ViewStateChangeEvent) => void;
	centreMarker?: boolean;
	draggableMarker?: boolean;
	onZoom?: (zoom: number) => void;
	onMove?: (data: ViewStateChangeEvent) => void;
}

export const clusterLayer: LayerProps = {
	id: 'clusters',
	type: 'circle',
	source: 'points',
	filter: ['has', 'point_count'],
	paint: {
		'circle-color': ['step', ['get', 'point_count'], '#8517FF', 10, '#8517FF', 20, '#A85CFF'],
		'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
	},
};

export const clusterCountLayer: LayerProps = {
	id: 'cluster-count',
	type: 'symbol',
	source: 'points',
	filter: ['has', 'point_count'],
	layout: {
		'text-field': '{point_count_abbreviated}',
		'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
		'text-size': 12,
	},
	paint: {
		'text-color': '#ffffff',
	},
};

export const unclusteredPointLayer: LayerProps = {
	id: 'unclustered-point',
	type: 'circle',
	source: 'points',
	filter: ['!', ['has', 'point_count']],
	paint: {
		'circle-color': '#30D968',
		'circle-radius': 8,
		'circle-stroke-width': 0,
	},
};

export function Map(props: MapProps) {
	const getBoundsForPoints = (
		clusters?: {
			longitude: number;
			latitude: number;
			id: number;
			name: string;
		}[]
	) => {
		// Calculate corner values of bounds
		const pointsLong = clusters?.map?.((point) => point.longitude);
		const pointsLat = clusters?.map?.((point) => point.latitude);

		if (!pointsLong?.length || !pointsLat?.length) {
			return {
				longitude: !!props.lng ? props.lng : -0.089119,
				latitude: !!props.lat ? props.lat : 51.513459,
				zoom: !!props.zoom ? props.zoom : 5,
			};
		}

		const cornersLongLat = [
			[Math.min(...pointsLong), Math.min(...pointsLat)],
			[Math.max(...pointsLong), Math.max(...pointsLat)],
		];
		// Use WebMercatorViewport to get center longitude/latitude and zoom
		const viewport = new WebMercatorViewport({
			height: 400,
			width: 400,
		})?.fitBounds(cornersLongLat as any, {
			padding: 20,
		}); // Can also use option: offset: [0, -100]
		const { longitude, latitude, zoom } = viewport;
		return {
			longitude: !!props.lng ? props.lng : longitude,
			latitude: !!props.lat ? props.lat : latitude,
			zoom: !!props.zoom ? props.zoom : zoom > 16 ? 16 : zoom,
		};
	};

	const { centreMarker = true, draggableMarker = true } = props;
	const theme = useTheme();

	const $map = useRef<{ getMap(): MapboxGL.Map }>(null);
	const [expanded, setExpanded] = useState(false);

	const handleMapMove = ({
		viewState: { longitude, latitude, zoom, ...rest },
	}: ViewStateChangeEvent) => {
		setViewport({ longitude, latitude, zoom, ...rest });
	};

	const onClick = (event: MapboxGL.MapLayerMouseEvent) => {
		const map = $map.current?.getMap();

		const feature = event?.features?.[0];
		const clusterId = feature?.properties?.cluster_id;

		const mapboxSource = map?.getSource?.('points') as MapboxGL.GeoJSONSource;

		mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
			if (err) {
				return;
			}

			console.log((feature?.geometry as any)?.coordinates, 'coordinates');

			if ((feature?.geometry as any)?.coordinates) {
				map?.easeTo?.({
					center: (feature?.geometry as any)?.coordinates as [number, number],
					zoom: zoom ?? 12,
					duration: 500,
				});
			}
			return;
		});
	};

	const bounds = getBoundsForPoints(props.clusters ?? []);

	const [viewport, setViewport] = useState({
		...bounds,
		latitude: bounds?.latitude ?? props.lat,
		longitude: bounds?.longitude ?? props.lng,
	});

	return (
		<div
			className="relative [&_.mapboxgl-canvas]:rounded-md [&_.mapboxgl-canvas]:border"
			style={{
				height: !!props.height ? props.height : undefined,
			}}
		>
			<Dialog open={expanded} onOpenChange={(open) => setExpanded(open)}>
				<DialogContent className="min-h-[90vh] min-w-[90vw]">
					{expanded ? <Map {...props} {...viewport} fullscreen={true} /> : null}
				</DialogContent>
			</Dialog>

			{props.expandable && !props.fullscreen ? (
				<Button
					variant="ghost"
					className="absolute right-2 bottom-2 z-20"
					onClick={() => setExpanded((prev) => !prev)}
				>
					{expanded ? <FaExpandAlt size={20} /> : <FaExpand size={20} />}
				</Button>
			) : null}
			{!!props.directions || !!props.title?.length || !!props.description?.length ? (
				<div className="flex gap-6 mb-4 items-center mt-5">
					<div className="flex-1">
						{props.title && <p className="font-medium">{props.title}</p>}
						{props.description && (
							<p className="text-sm text-muted-foreground">{props.description}</p>
						)}
					</div>
					{props.directions && (
						<Link
							target="_blank"
							rel="noopener noreferrer"
							href={`https://www.google.com/maps/dir/?api=1&destination=${viewport.longitude},${viewport.longitude}`}
						>
							<Button variant="outline">Get Directions</Button>
						</Link>
					)}
				</div>
			) : null}
			<ReactMapGL
				{...viewport}
				ref={$map as any}
				mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
				attributionControl={false}
				onZoom={handleMapMove}
				onMove={handleMapMove}
				interactiveLayerIds={[clusterLayer?.id ?? '']}
				onClick={(e) => onClick(e)}
				maxZoom={20}
				style={{
					width: '100%',
					height: !!props.height
						? props.height
						: props.fullscreen
						? '80vh'
						: 'clamp(250px, 400px, 400px)',
					borderRadius: '8px',
					flexShrink: 0,
					maxHeight: '100vh',
				}}
				mapStyle={
					theme.theme === 'dark'
						? 'mapbox://styles/mapbox/dark-v11?optimize=true'
						: 'mapbox://styles/mapbox/light-v10?optimize=true'
				}
			>
				{!!props.clusters ? (
					<div>
						<Source
							id="points"
							type="geojson"
							data={{
								type: 'FeatureCollection',
								features: props.clusters.map((point) => ({
									type: 'Feature',
									properties: {
										cluster: false,
										id: point.id,
										name: point.name,
									},
									geometry: {
										type: 'Point',
										coordinates: [point.longitude, point.latitude],
									},
								})),
							}}
							cluster={true}
							maxzoom={15}
							clusterRadius={50}
						>
							<Layer {...clusterLayer} />
							<Layer {...clusterCountLayer} />
							<Layer {...unclusteredPointLayer} />
						</Source>
					</div>
				) : null}

				{centreMarker ? (
					<Marker
						className="absolute top-0 "
						longitude={draggableMarker ? viewport?.longitude ?? 0 : props.lng ?? 0}
						latitude={draggableMarker ? viewport?.latitude ?? 0 : props.lat ?? 0}
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
				) : null}
				{props.children}
			</ReactMapGL>
		</div>
	);
}
