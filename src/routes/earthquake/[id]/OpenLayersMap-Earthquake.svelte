<script lang="ts">
	import { onMount } from 'svelte';
	import 'ol/ol.css';
	import Map from 'ol/Map';
	import View from 'ol/View';
	import TileLayer from 'ol/layer/Tile';
	import OSM from 'ol/source/OSM';

	// This is used to convert from [longitude, latitude]
	// to a coordinate system OpenLayers can read.
	// https://stackoverflow.com/questions/27820784/openlayers-3-center-map
	import { fromLonLat, toLonLat } from 'ol/proj';

	// This is used to check the current theme mode of the webpage.
	import { modeCurrent } from '@skeletonlabs/skeleton';

	// This is used for the markers in the OpenStreetMap.
	import Feature from 'ol/Feature';
	import Point from 'ol/geom/Point';
	import VectorSource from 'ol/source/Vector';
	import { Icon, Style } from 'ol/style';
	import VectorLayer from 'ol/layer/Vector';
	import GeoJSON from 'ol/format/GeoJSON.js';

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	// Take JSON data of points from /src/routes/map/+page.svelte
	// dirty way: PageData automatically gives the type of the data
	import type { PageData } from './$types';
	import type { MapBrowserEvent } from 'ol';
	import { goto } from '$app/navigation';
	import MagnitudeCard from '$lib/components/ui/MagnitudeCard.svelte';
	export let data: PageData;

	// Initialize the tilesets, map, and mount.
	// Note that the tile_server will have change
	// dynamically depending on the current theme/mode.
	const tile_server = new OSM(); // tilemap
	let mapElement: HTMLElement;
	let mountedMap: Map;

	let earthquakeLayer = new VectorLayer();
	let locationLayer = new VectorLayer();

	function calculateDistanceinMeters(pointA, pointB) {
	const radius = 6371e3; // Earth's radius in meters

	const lat1 = (pointA.coordinates[1] * Math.PI) / 180;
	const lat2 = (pointB.coordinates[1] * Math.PI) / 180;
	const deltaLat = ((pointB.coordinates[1] - pointA.coordinates[1]) * Math.PI) / 180;
	const deltaLon = ((pointB.coordinates[0] - pointA.coordinates[0]) * Math.PI) / 180;

	const a =
		Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
		Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	const distance = radius * c; // Distance in meters

	return distance;
	}

	const maxMagnitude = data.selectedEarthquake.mw;
	const maxDistance = data.affectedLocations.reduce((max, location, index) => {
		if (!location.coord) return max;
		const distance = calculateDistanceinMeters(location.coord, data.selectedEarthquake.coord);
		data.affectedLocations[index].distance = distance;
		return distance > max ? distance : max;
		}, 0);

	function reversedLogScaleDistribution(specificDistance: number) {
		const sqrtScale = (Math.sqrt(specificDistance) / Math.sqrt(maxDistance)) * (maxMagnitude - 1) + 1;
		const reversedScale = maxMagnitude - (sqrtScale - 1);
		const rounded = Math.round(reversedScale)
		intensityRecord[rounded] += 1;
		return rounded;
	}

	const intensityRecord: Record<number, number> = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0}

	function getZoomLevelFromDistance(km: number): number {

    // List of distances corresponding to each zoom level.
    const levels = [40000, 20000, 10000, 5000, 2500, 1250, 625, 312.5, 156, 78, 39, 19.5, 10, 5, 2.5, 1.2, 0.6, 0.3, 0.15, 0.075, 0.0375];
    
    // Find the appropriate zoom level where the distance is just smaller than the given km.
    const zoomLevel = levels.findIndex(level => km >= level);

    // Return the zoom level, if no valid level is found return 21, as it is the closest and most detailed level.
    return zoomLevel === -1 ? 21 : zoomLevel;
}
	onMount(() => {
		mountedMap = new Map({
			target: mapElement,
			layers: [
				new TileLayer({
					// tile_server is where the links to the themes will be placed
					// https://github.com/CartoDB/basemap-styles
					source: tile_server
				}),
				new VectorLayer({
					source: new VectorSource({
						format: new GeoJSON(),
						url: '/philippines-geojson.json' // Replace with your GeoJSON file path
					})
				})
			],
			view: new View({
				center: fromLonLat([
					data.selectedEarthquake.coord.coordinates[0],
					data.selectedEarthquake.coord.coordinates[1]
				]), // Center of the map [longitude, latitude]
				zoom: getZoomLevelFromDistance(maxDistance/1000)
			})
		});

		const geojsonLayer = new VectorLayer({
			//title: 'GeoJSON Layer',
			source: new VectorSource({
				format: new GeoJSON(),
				url: '/philippines-geojson.json' // Replace with your GeoJSON file path
			})
		});
		mountedMap.addLayer(geojsonLayer);

		var vectorSource = new VectorSource();

		// Iterate over the data to create and add each marker
		//console.log('earthquake', data.selectedEarthquake);
		if (typeof data.selectedEarthquake !== 'boolean') {
			const item = data.selectedEarthquake;
			var marker = new Feature({
				name: item._id,
				geometry: new Point(
					fromLonLat([item.coord.coordinates[0], item.coord.coordinates[1]]) // Marker position
				),
				attributes: {
					pinType: 'earthquake',
					time: `${item.time}`
				}
			});

			const intensity = Math.round(Number(item.mw));
			let icon = new Icon({
				width: 30,
				height: 30,
				src: `/epicenter.png`
			});

			// Create a style for the marker
			var iconStyle = new Style({
				image: icon
			});

			// Apply the style to the marker
			marker.setStyle(iconStyle);

			// Add the marker to the vector source
			vectorSource.addFeature(marker);
		}

		// Add the vector source to a layer and add it to the map
		//const earthquakeLayer = new VectorLayer({
		//	source: vectorSource,
		//});
		earthquakeLayer.setSource(vectorSource);

		vectorSource = new VectorSource();
		// Iterate over the data to create and add each marker
		if (typeof data.affectedLocations !== undefined) {
			data.affectedLocations.forEach((item) => {
				//console.log(item);
				if (!item.coord) return;
				const marker = new Feature({
					name: item.psgc,
					geometry: new Point(fromLonLat([item.coord?.coordinates[0], item.coord?.coordinates[1]])),
					attributes: {
						pinType: 'location',
						name: `${item.longname}`,
					}
				});

				const icon = new Icon({
					width: 20,
					height: 20,
					src: `../seismic-${reversedLogScaleDistribution(item.distance)}.png`
				});

				const iconStyle = new Style({
					image: icon
				});

				marker.setStyle(iconStyle);
				vectorSource.addFeature(marker);
			});
		}

		// Add the vector source to a layer and add it to the map
		//const evacLayer = new VectorLayer({
		//	source: vectorSource,
		//});
		locationLayer.setSource(vectorSource);
		mountedMap.addLayer(locationLayer);
		mountedMap.addLayer(earthquakeLayer);

		// Add the vector source to a layer and add it to the map
		//var markerLayer = new VectorLayer({
		//	source: vectorSource,
		//});
		//mountedMap.addLayer(markerLayer);

		//mountedMap.on('pointermove', function (evt) {
		//  if (evt.dragging) {
		//    info.style.visibility = 'hidden';
		//    currentFeature = undefined;
		//    return;
		//  }
		//  const pixel = mountedMap.getEventPixel(evt.originalEvent);
		//  displayFeatureInfo(pixel, evt.originalEvent.target);
		//});

		let curr_longitude: number = 0;
		let curr_latitude: number = 0;

		async function onMapClick({ dragging, map, coordinate }: MapBrowserEvent<any>) {
			//console.log('started onMapClick function');
			////console.log(coordinate);
			const convertedCoordinate = toLonLat(coordinate);
			////console.log(convertedCoordinate);

			curr_longitude = convertedCoordinate[0];
			curr_latitude = convertedCoordinate[1];

			if (!dragging) {
				const pixel = map.getPixelFromCoordinate(coordinate);
				const [feat, ..._] = map.getFeaturesAtPixel(pixel);

				// feat = 0th elem of array of features
				if (typeof feat !== 'undefined') {
					//console.log('is defined');
					//console.log(feat);
					const obtained_id = feat.get('name');

					const pinType = feat.get('attributes').pinType;
					//console.log(pinType);
					if (typeof obtained_id !== 'undefined') {
						if (pinType == 'earthquake') await goto(`/earthquake/${obtained_id}`);
						else if (pinType == 'seismic station') await goto(`/seismic/${obtained_id}`);
						// else if (pinType == 'location') await goto(`/locations/${obtained_id}`);
					}
					return;
				}
			}
		}

		mountedMap.on('click', onMapClick);

		let previousToast: string;

		function onMapHover({ dragging, map, coordinate }: MapBrowserEvent<any>) {
			//console.log('started onMapHover function');
			//console.log(curr_longitude, curr_latitude);

			if (!dragging) {
				const pixel = map.getPixelFromCoordinate(coordinate);
				const [feat, ..._] = map.getFeaturesAtPixel(pixel);
				toastStore.close(previousToast);
				toastStore.clear();

				// feat = 0th elem of array of features
				if (typeof feat !== 'undefined') {
					//console.log('is defined');
					//console.log(feat);

					const gotten_feature = feat.get('attributes');

					const pinType = gotten_feature.pinType;

					if (typeof pinType !== 'undefined') {
						switch (pinType) {
							case 'earthquake': {
								previousToast = toastStore.trigger({
									message: `${pinType} ${gotten_feature.time}`,
									background: 'variant-filled-primary',
									autohide: true
								});
								break;
							}
							case 'location': {
								previousToast = toastStore.trigger({
									message: `${pinType} ${gotten_feature.name}`,
									background: 'variant-filled-tertiary',
									autohide: true
								});
								break;
							}
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
		switch (iconType) {
			case 'earthquake': {
				earthquakeLayer.setVisible(isHidden[0]);
				isHidden[0] = !isHidden[0];
				break;
			}
			case 'location': {
				locationLayer.setVisible(isHidden[1]);
				isHidden[1] = !isHidden[1];
				break;
			}
		}
		return;
	}

	// Dynamically change the themeURL and tile_server link.
	let themeURL: string;
	$: themeURL = $modeCurrent
		? 'https://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
		: 'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

	$: tile_server.setUrl(themeURL);

	function blinkFeature() {
		let visible = true;
		setInterval(() => {
			visible =  !visible;
			if (!pause) {
			if (isHidden[0]) visible = false;
			earthquakeLayer.setVisible(visible)
			locationLayer.setVisible(!visible)
			}
		}, 2000);
	}
	blinkFeature();

	let pause = false;
</script>

<div bind:this={mapElement} class="relative h-96 w-screen mb-10">
	<div class="absolute bottom-0 select-none z-10">
		<div class="flex flex-col">
			<section class="flex flex-row items-center" on:click={() => pause = !pause}>
				<input type="checkbox" class="checkbox mr-2" checked={pause}>
				<p class="underline decoration-dotted">
					{#if !pause}
					Pause Animation
					{:else}
					Continue Animation
					{/if} 
				</p>
			</section>
			<section class="flex flex-row items-center" on:click={() => showOrHideIcons('earthquake')}>
				<input type="checkbox" class="checkbox mr-2" checked={isHidden[0]}>
				<p class="underline decoration-dotted">
					{#if isHidden[0]}
					Show Earthquakes
					{:else}
					Hide Earthquakes
					{/if} 
				</p>
			</section>
			<section class="flex flex-row items-center" on:click={() => showOrHideIcons('location')}>
				<input type="checkbox" class="checkbox mr-2" checked={isHidden[1]}>
				<p class="underline decoration-dotted">
					{#if isHidden[1]}
					Show Locations
					{:else}
					Hide Locations
					{/if} 
				</p>
			</section>
			<button type="button" class="btn btn-sm variant-filled max-w-48">
				<a href="/map/tectonic"> See Tectonic Plates </a>
			</button>
		</div>
	</div>
	<div class="absolute bottom-0 right-3 select-none z-10 dark:bg-black/[0.7] bg-white/[0.7]">
		<MagnitudeCard magnitude={data.selectedEarthquake.mw} text/>
		<p class="m-2"><i class="fa-solid fa-house-circle-exclamation"></i> {data.locationSize.toLocaleString()} locations</p>
		<div class="flex flex-row"></div>
		{#each Object.entries(intensityRecord).map(([k, v]) => ({intensity: k, count: v})).reverse() as entry}
			{#if entry.count !== 0}
				<div class="flex flex-row">
					<img class="object-none mx-2" src={`/seismic-${entry.intensity}.png`} /> <span> - {entry.count}</span>
				</div>
			{/if}
		{/each}
		<p class="m-2"><i class="fa-solid fa-person"></i> {data.affectedPopulation.toLocaleString()}</p>
	</div>
</div>