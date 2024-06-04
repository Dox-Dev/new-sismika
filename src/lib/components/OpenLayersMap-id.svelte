<!-- 
This SvelteKit component displays an interactive OpenStreetMap using the OpenLayers library.
It provides functionality to toggle the visibility of different types of icons (earthquakes, seismic centers, evacuation centers) on the map and dynamically changes the map theme based on the current mode.

Functionality:
- Displays earthquake, seismic station, and evacuation center markers on the map.
- Allows users to toggle the visibility of these markers.
- Changes the map theme dynamically based on the current theme mode.
- Shows detailed information about markers when hovered and navigates to detailed views when clicked.

Props:
- data (PageData): The dataset containing information about earthquakes, seismic stations, and evacuation centers.

The component structure:
- Script: Imports necessary libraries, initializes the map and layers, defines functions for toggling icon visibility and handling map interactions.
- Div: Binds the map element and contains buttons for toggling marker visibility.

Styling and behavior:
- The map and buttons use Tailwind CSS classes for styling.
- The user image is styled to maintain aspect ratio and have rounded corners.

Dependencies:
- OpenLayers: Provides the mapping and geospatial functionality.
- Skeleton UI: Provides utility functions and components.
- Tailwind CSS: Provides utility classes for responsive design and styling.
- SvelteKit: Provides navigation functionality.
-->

<script lang="ts">
	import { onMount } from 'svelte';
	import 'ol/ol.css';
	import Map from 'ol/Map';
	import View from 'ol/View';
	import TileLayer from 'ol/layer/Tile';
	import OSM from 'ol/source/OSM';
	import { fromLonLat, toLonLat } from 'ol/proj';
	import { modeCurrent } from '@skeletonlabs/skeleton';
	import Feature from 'ol/Feature';
	import Point from 'ol/geom/Point';
	import VectorSource from 'ol/source/Vector';
	import { Icon, Style } from 'ol/style';
	import VectorLayer from 'ol/layer/Vector';
	import GeoJSON from 'ol/format/GeoJSON.js';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import type { Pixel } from 'ol/pixel';
	import type { MapBrowserEvent } from 'ol';
	import { goto } from '$app/navigation';
	import type { Coordinate } from 'ol/coordinate';

	const toastStore = getToastStore();

	export let data: PageData;

	const tile_server = new OSM(); // tilemap
	let mapElement: HTMLElement;
	let mountedMap: Map;

	let earthquakeLayer = new VectorLayer();
	let seismicLayer = new VectorLayer();
	let evacLayer = new VectorLayer();

	onMount(() => {
		// Initialize the map
		mountedMap = new Map({
			target: mapElement,
			layers: [
				new TileLayer({
					source: tile_server
				}),
				new VectorLayer({
					source: new VectorSource({
						format: new GeoJSON(),
						url: './src/lib/assets/philippines-geojson.json' // Replace with your GeoJSON file path
					})
				})
			],
			view: new View({
				center: fromLonLat([122.0641419, 9.16875]), // Center of the map [longitude, latitude]
				zoom: 6 // Initial zoom level
			})
		});

		const geojsonLayer = new VectorLayer({
			source: new VectorSource({
				format: new GeoJSON(),
				url: './src/lib/assets/philippines-geojson.json' // Replace with your GeoJSON file path
			})
		});
		mountedMap.addLayer(geojsonLayer);

		var vectorSource = new VectorSource();

		// Add earthquake markers
		if (typeof data.equake !== 'boolean') {
			data.equake.forEach(function (item) {
				var marker = new Feature({
					name: item._id,
					geometry: new Point(fromLonLat([item.coord.coordinates[0], item.coord.coordinates[1]])),
					attributes: {
						pinType: 'earthquake',
						time: `${item.time}`
					}
				});

				let icon = new Icon({
					width: 20,
					height: 20,
					src: '/earthquake.png'
				});

				var iconStyle = new Style({
					image: icon
				});

				marker.setStyle(iconStyle);
				vectorSource.addFeature(marker);
			});
		}
		earthquakeLayer.setSource(vectorSource);
		mountedMap.addLayer(earthquakeLayer);

		vectorSource = new VectorSource();

		// Add seismic station markers
		if (typeof data.station !== 'boolean') {
			data.station.forEach(function (item) {
				var marker = new Feature({
					name: item._id,
					geometry: new Point(fromLonLat([item.coord.coordinates[0], item.coord.coordinates[1]])),
					attributes: {
						pinType: 'seismic station',
						code: `${item.code}`,
						name: `${item.name}`
					}
				});

				let icon = new Icon({
					width: 20,
					height: 20,
					src: '/station.png'
				});

				var iconStyle = new Style({
					image: icon
				});

				marker.setStyle(iconStyle);
				vectorSource.addFeature(marker);
			});
		}
		seismicLayer.setSource(vectorSource);
		mountedMap.addLayer(seismicLayer);

		vectorSource = new VectorSource();

		// Add evacuation center markers
		if (typeof data.evac !== 'boolean') {
			data.evac.forEach(function (item) {
				var marker = new Feature({
					name: item._id,
					geometry: new Point(fromLonLat([item.coord.coordinates[0], item.coord.coordinates[1]])),
					attributes: {
						pinType: 'evacuation center',
						name: `${item.name}`
					}
				});

				let icon = new Icon({
					width: 20,
					height: 20,
					src: '/evacuation.png'
				});

				var iconStyle = new Style({
					image: icon
				});

				marker.setStyle(iconStyle);
				vectorSource.addFeature(marker);
			});
		}
		evacLayer.setSource(vectorSource);
		mountedMap.addLayer(evacLayer);

		// Handle map click event
		async function onMapClick({ dragging, map, coordinate }: MapBrowserEvent<any>) {
			const convertedCoordinate = toLonLat(coordinate);

			if (!dragging) {
				const pixel = map.getPixelFromCoordinate(coordinate);
				const [feat, ..._] = map.getFeaturesAtPixel(pixel);

				if (typeof feat !== 'undefined') {
					const obtained_id = feat.get('name');
					const pinType = feat.get('attributes').pinType;
					if (typeof obtained_id !== 'undefined') {
						if (pinType == 'earthquake') await goto(`/earthquake/${obtained_id}`);
						else if (pinType == 'seismic station') await goto(`/seismic/${obtained_id}`);
						else if (pinType == 'evacuation center') await goto(`/evaccenter/${obtained_id}`);
					}
					return;
				}
			}
		}
		mountedMap.on('click', onMapClick);

		let previousToast: string;

		// Handle map hover event
		function onMapHover({ dragging, map, coordinate }: MapBrowserEvent<any>) {
			if (!dragging) {
				const pixel = map.getPixelFromCoordinate(coordinate);
				const [feat, ..._] = map.getFeaturesAtPixel(pixel);
				toastStore.close(previousToast);
				toastStore.clear();

				if (typeof feat !== 'undefined') {
					const gotten_feature = feat.get('attributes');
					const pinType = gotten_feature.pinType;
					if (typeof pinType !== 'undefined') {
						if (pinType == 'earthquake') {
							previousToast = toastStore.trigger({
								message: `${pinType} ${gotten_feature.time}`,
								background: 'variant-filled-primary',
								autohide: true
							});
						} else if (pinType == 'seismic station') {
							previousToast = toastStore.trigger({
								message: `${pinType} ${gotten_feature.code} ${gotten_feature.name}`,
								background: 'variant-filled-secondary',
								autohide: true
							});
						} else if (pinType == 'evacuation center') {
							previousToast = toastStore.trigger({
								message: `${pinType} ${gotten_feature.name}`,
								background: 'variant-filled-tertiary',
								autohide: true
							});
						} else if (pinType == 'geoJSON') {
							previousToast = toastStore.trigger({
								message: `${pinType} ${feat.get('adm1_en')}`,
								background: 'variant-filled-success',
								autohide: true
							});
						}
					}
				}
			}
			return;
		}
		mountedMap.on('pointermove', onMapHover);
	});

	let isHidden: Array<boolean> = [false, false, false]; // earthquake, seismic center, evaccenter
	export function showOrHideIcons(iconType: string) {
		if (iconType == 'earthquake') {
			if (isHidden[0])
				earthquakeLayer.setVisible(true); // show icon type
			else earthquakeLayer.setVisible(false); // hide icon
			isHidden[0] = !isHidden[0];
		} else if (iconType == 'seismic center') {
			if (isHidden[1])
				seismicLayer.setVisible(true); // show icon type
			else seismicLayer.setVisible(false); // hide icon
			isHidden[1] = !isHidden[1];
		} else if (iconType == 'evacuation center') {
			if (isHidden[2])
				evacLayer.setVisible(true); // show icon type
			else evacLayer.setVisible(false); // hide icon
			isHidden[2] = !isHidden[2];
		}
		return;
	}

	// Dynamically change the themeURL and tile_server link based on theme mode
	let themeURL: string;
	$: themeURL = $modeCurrent
		? 'https://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
		: 'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
	$: tile_server.setUrl(themeURL);
</script>

<!-- Map container -->
<div bind:this={mapElement} class="map">
	<!-- Buttons to toggle visibility of different markers -->
	<button
		type="button"
		class="btn btn-sm variant-filled"
		on:click={() => showOrHideIcons('earthquake')}
	>
		{#if isHidden[0]}
			Show Earthquakes
		{:else}
			Hide Earthquakes
		{/if}
	</button>
	<button
		type="button"
		class="btn btn-sm variant-filled"
		on:click={() => showOrHideIcons('seismic center')}
	>
		{#if isHidden[1]}
			Show Seismic Centers
		{:else}
			Hide Seismic Centers
		{/if}
	</button>
	<button
		type="button"
		class="btn btn-sm variant-filled"
		on:click={() => showOrHideIcons('evacuation center')}
	>
		{#if isHidden[2]}
			Show Evacuation Centers
		{:else}
			Hide Evacuation Centers
		{/if}
	</button>
</div>

<style>
	.map {
		height: 1080px; /* Specify a height for the map */
		width: 100%; /* Full width */
	}
</style>
