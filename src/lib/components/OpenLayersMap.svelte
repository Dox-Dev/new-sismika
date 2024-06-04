<script lang="ts">
	import { onMount } from 'svelte'; // Import onMount from Svelte for component lifecycle management
	import 'ol/ol.css'; // Import OpenLayers CSS for styling
	import Map from 'ol/Map'; // Import OpenLayers Map
	import View from 'ol/View'; // Import OpenLayers View
	import TileLayer from 'ol/layer/Tile'; // Import OpenLayers TileLayer
	import OSM from 'ol/source/OSM'; // Import OpenLayers OSM source
	import { fromLonLat } from 'ol/proj'; // Import function for coordinate conversion
	import { modeCurrent } from '@skeletonlabs/skeleton'; // Import current theme mode from Skeleton UI
	import Feature from 'ol/Feature'; // Import OpenLayers Feature
	import Point from 'ol/geom/Point'; // Import OpenLayers Point geometry
	import VectorSource from 'ol/source/Vector'; // Import OpenLayers VectorSource
	import { Icon, Style } from 'ol/style'; // Import OpenLayers Icon and Style
	import VectorLayer from 'ol/layer/Vector'; // Import OpenLayers VectorLayer
	import GeoJSON from 'ol/format/GeoJSON.js'; // Import OpenLayers GeoJSON format

	export let data; // Prop for the dataset

	const tile_server = new OSM(); // Initialize OSM tile server
	let mapElement: HTMLElement; // Map element reference
	let mountedMap: Map; // Map instance

	onMount(() => {
		// Initialize the map
		mountedMap = new Map({
			target: mapElement,
			layers: [
				new TileLayer({
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

		// Add earthquake markers
		data.equake.forEach(function (item) {
			var marker = new Feature({
				name: item.id,
				geometry: new Point(fromLonLat([item.coord.coordinates[0], item.coord.coordinates[1]]))
			});

			const intensity = Math.round(Number(item.mw));
			let icon = new Icon({
				width: 20,
				height: 20,
				src: `./src/lib/assets/seismic-${intensity}.png`
			});

			var iconStyle = new Style({
				image: icon
			});

			marker.setStyle(iconStyle);
			vectorSource.addFeature(marker);
		});

		// Add seismic station markers
		data.station.forEach(function (item) {
			var marker = new Feature({
				geometry: new Point(fromLonLat([item.coord.coordinates[1], item.coord.coordinates[0]]))
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

		// Add evacuation center markers
		data.evac.forEach(function (item) {
			var marker = new Feature({
				geometry: new Point(fromLonLat([item.coord.coordinates[0], item.coord.coordinates[1]]))
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

		var markerLayer = new VectorLayer({
			source: vectorSource
		});
		mountedMap.addLayer(markerLayer);
	});

	// Dynamically change the themeURL and tile_server link based on theme mode
	let themeURL: string;
	$: themeURL = $modeCurrent
		? 'https://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
		: 'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
	$: tile_server.setUrl(themeURL);
</script>

<!-- Map container -->
<div bind:this={mapElement} class="map"></div>

<style>
	.map {
		height: 1080px; /* Specify a height for the map */
		width: 100%; /* Full width */
	}
</style>
