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
	export let data: PageData;

	// Initialize the tilesets, map, and mount.
	// Note that the tile_server will have change
	// dynamically depending on the current theme/mode.
	const tile_server = new OSM(); // tilemap
	let mapElement: HTMLElement;
	let mountedMap: Map;

	let earthquakeLayer = new VectorLayer();
	let locationLayer = new VectorLayer();

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
				zoom: 6 // Initial zoom level
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
		console.log('earthquake', data.selectedEarthquake);
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
				width: 20,
				height: 20,
				src: `../seismic-${intensity}.png`
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
				console.log(item);
				if (!item.coord) return;
				const marker = new Feature({
					name: item.psgc,
					geometry: new Point(fromLonLat([item.coord?.coordinates[0], item.coord?.coordinates[1]])),
					attributes: {
						pinType: 'location',
						name: `${item.longname}`
					}
				});

				const icon = new Icon({
					width: 10,
					height: 10,
					src: `../seismic-1.png`
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
			console.log('started onMapClick function');
			//console.log(coordinate);
			const convertedCoordinate = toLonLat(coordinate);
			//console.log(convertedCoordinate);

			curr_longitude = convertedCoordinate[0];
			curr_latitude = convertedCoordinate[1];

			if (!dragging) {
				const pixel = map.getPixelFromCoordinate(coordinate);
				const [feat, ..._] = map.getFeaturesAtPixel(pixel);

				// feat = 0th elem of array of features
				if (typeof feat !== 'undefined') {
					console.log('is defined');
					console.log(feat);
					const obtained_id = feat.get('name');

					const pinType = feat.get('attributes').pinType;
					console.log(pinType);
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

		function onMapHover({ dragging, map, coordinate }: MapBrowserEvent<any>) {
			console.log('started onMapHover function');
			console.log(curr_longitude, curr_latitude);

			if (!dragging) {
				const pixel = map.getPixelFromCoordinate(coordinate);
				const [feat, ..._] = map.getFeaturesAtPixel(pixel);
				toastStore.close(previousToast);
				toastStore.clear();

				// feat = 0th elem of array of features
				if (typeof feat !== 'undefined') {
					console.log('is defined');
					console.log(feat);

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
</script>

<div bind:this={mapElement} class="map">
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
		on:click={() => showOrHideIcons('location')}
	>
		{#if isHidden[1]}
			Show Locations
		{:else}
			Hide Locations
		{/if}
	</button>
</div>

<style>
	.map {
		height: 20vh; /* Specify a height for the map */
		width: 100%; /* Full width */
	}
</style>
