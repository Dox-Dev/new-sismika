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
	import { fromLonLat } from 'ol/proj';

	// This is used to check the current theme mode of the webpage.
	import { modeCurrent } from '@skeletonlabs/skeleton';

	// This is used for the markers in the OpenStreetMap.
	import VectorSource from 'ol/source/Vector';
	import VectorLayer from 'ol/layer/Vector';
	import GeoJSON from 'ol/format/GeoJSON.js';

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	// Take JSON data of points from /src/routes/map/+page.svelte
	import type { MapBrowserEvent } from 'ol';

	// Initialize the tilesets, map, and mount.
	// Note that the tile_server will have change
	// dynamically depending on the current theme/mode.
	const tile_server = new OSM(); // tilemap
	let mapElement: HTMLElement;
	let mountedMap: Map;

	let earthquakeLayer = new VectorLayer();
	let seismicLayer = new VectorLayer();
	let evacLayer = new VectorLayer();

	onMount(() => {
		mountedMap = new Map({
			target: mapElement,
			layers: [
				new TileLayer({
					// tile_server is where the links to the themes will be placed
					// https://github.com/CartoDB/basemap-styles
					source: tile_server
				})
			],
			view: new View({
				center: fromLonLat([122.0641419, 9.16875]), // Center of the map [longitude, latitude]
				zoom: 6 // Initial zoom level
			})
		});

		const platesGeojsonLayer = new VectorLayer({
			//title: 'GeoJSON Layer',
			source: new VectorSource({
				format: new GeoJSON(),
				url: '/plates-geojson.json' // Replace with your GeoJSON file path
			})
		});
		mountedMap.addLayer(platesGeojsonLayer);

		let curr_longitude: number = 0;
		let curr_latitude: number = 0;

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
						if (pinType == 'plate') {
							previousToast = toastStore.trigger({
								message: `${feat.get('PlateName')} Plate`,
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

	// Dynamically change the themeURL and tile_server link.
	let themeURL: string;
	$: themeURL = $modeCurrent
		? 'https://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
		: 'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

	$: tile_server.setUrl(themeURL);
</script>

<div bind:this={mapElement} class="relative top-0 left-0 h-screen w-screen" />

<div class="absolute top-16 right-0">
	<button type="button" class="btn btn-sm variant-filled" on:click={() => history.back()}>
		Return to Pins and Country Regions
	</button>
</div>