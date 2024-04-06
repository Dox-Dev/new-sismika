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
	import Feature from 'ol/Feature';
	import Point from 'ol/geom/Point';
	import VectorSource from 'ol/source/Vector';
	import { Icon, Style } from 'ol/style';
	import VectorLayer from 'ol/layer/Vector';
	import GeoJSON from 'ol/format/GeoJSON.js';

	// Take JSON data of points from /src/routes/map/+page.svelte
	export let data;

	// Initialize the tilesets, map, and mount.
	// Note that the tile_server will have change
	// dynamically depending on the current theme/mode.
	const tile_server = new OSM(); // tilemap
	let mapElement: HTMLElement;
	let mountedMap: Map;

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
					title: 'GeoJSON Layer',
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

		var vectorSource = new VectorSource();

		// Iterate over the data to create and add each marker
		console.log('earthquake', data.equake);
		data.equake.forEach(function (item) {
			console.log('earthquake', item.coord.coordinates[0], item.coord.coordinates[1]);
			// Create a feature for the marker
			var marker = new Feature({
				name: item.id,
				geometry: new Point(
					fromLonLat([item.coord.coordinates[0], item.coord.coordinates[1]]) // Marker position
				)
			});

			const intensity = Math.round(Number(item.mw))
			let icon = new Icon({
				width: 20,
				height: 20,
				src: `./src/lib/assets/seismic-${intensity}.png`
			});

			// Create a style for the marker
			var iconStyle = new Style({
				image: icon
			});

			// Apply the style to the marker
			marker.setStyle(iconStyle);

			// Add the marker to the vector source
			vectorSource.addFeature(marker);
		});

		console.log('stations', data.station);
		data.station.forEach(function (item) {
			//console.log("station", item.coord.coordinates[0], item.coord.coordinates[1]);
			// Create a feature for the marker
			var marker = new Feature({
				geometry: new Point(
					fromLonLat([item.coord.coordinates[1], item.coord.coordinates[0]]) // Marker position
				)
			});

			let icon = new Icon({
				width: 20,
				height: 20,
				src: '/station.png'
			});

			// Create a style for the marker
			var iconStyle = new Style({
				image: icon
			});

			// Apply the style to the marker
			marker.setStyle(iconStyle);
			//console.log(marker);

			// Add the marker to the vector source
			vectorSource.addFeature(marker);
		});

		// Iterate over the data to create and add each marker
		console.log('evacuation centers', data.evac);
		data.evac.forEach(function (item) {
			console.log('evacuation', item.coord.coordinates[0], item.coord.coordinates[1]);
			// Create a feature for the marker
			var marker = new Feature({
				geometry: new Point(
					fromLonLat([item.coord.coordinates[0], item.coord.coordinates[1]]) // Marker position
				)
			});

			let icon = new Icon({
				width: 20,
				height: 20,
				src: '/evacuation.png'
			});

			// Create a style for the marker
			var iconStyle = new Style({
				image: icon
			});

			// Apply the style to the marker
			marker.setStyle(iconStyle);

			// Add the marker to the vector source
			vectorSource.addFeature(marker);
		});

		console.log(vectorSource);

		// Add the vector source to a layer and add it to the map
		var markerLayer = new VectorLayer({
			source: vectorSource
		});
		mountedMap.addLayer(markerLayer);
	});

	// Dynamically change the themeURL and tile_server link.
	let themeURL: string;
	$: themeURL = $modeCurrent
		? 'https://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
		: 'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

	$: tile_server.setUrl(themeURL);
</script>

<div bind:this={mapElement} class="map"></div>

<style>
	.map {
		height: 1080px; /* Specify a height for the map */
		width: 100%; /* Full width */
	}
</style>
