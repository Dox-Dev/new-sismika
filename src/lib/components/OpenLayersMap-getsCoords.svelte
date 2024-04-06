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
	import { fromLonLat, transform } from 'ol/proj';

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
	import type { Pixel } from 'ol/pixel';
	import type { MapBrowserEvent } from 'ol';
	import { goto } from '$app/navigation';
	export let data:PageData;

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
					source: new VectorSource({
						format: new GeoJSON(),
						url: './src/lib/assets/philippines-geojson.json' // Replace with your GeoJSON file path
					}),
				})
			],
			view: new View({
				center: fromLonLat([122.0641419, 9.16875]), // Center of the map [longitude, latitude]
				zoom: 6 // Initial zoom level
			})
		});

		const geojsonLayer = new VectorLayer({
			//title: 'GeoJSON Layer',
			source: new VectorSource({
				format: new GeoJSON(),
				url: './src/lib/assets/philippines-geojson.json' // Replace with your GeoJSON file path
			}),
		})
		mountedMap.addLayer(geojsonLayer);

		var vectorSource = new VectorSource();

		// Iterate over the data to create and add each marker
		console.log('earthquake', data.equake);
		if(typeof data.equake !== 'boolean') {
			data.equake.forEach(function (item) {
				console.log('earthquake', item._id, item.coord.coordinates[0], item.coord.coordinates[1]);
				// Create a feature for the marker
				var marker = new Feature({
					name: item._id,
					geometry: new Point(
						fromLonLat([item.coord.coordinates[0], item.coord.coordinates[1]]) // Marker position
					),
					attributes: {
						"pinType": "earthquake",
						"time": `${item.time}`,
					},
				});

				let icon = new Icon({
					width: 20,
					height: 20,
					src: '/earthquake.png'
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
		}

		console.log('stations', data.station);
		if(typeof data.station !== 'boolean') {
			data.station.forEach(function (item) {
				//console.log("station", item.coord.coordinates[0], item.coord.coordinates[1]);
				// Create a feature for the marker
				var marker = new Feature({
					geometry: new Point(
						fromLonLat([item.coord.coordinates[0], item.coord.coordinates[1]]) // Marker position
					),
					attributes: {
						"pinType": "seismic station",
						"code": `${item.code}`,
						"name": `${item.name}`,
					},
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
		}

		// Iterate over the data to create and add each marker
		console.log('evacuation centers', data.evac);
		if(typeof data.evac !== 'boolean') {
			data.evac.forEach(function (item) {
				console.log('evacuation', item.coord.coordinates[0], item.coord.coordinates[1]);
				// Create a feature for the marker
				var marker = new Feature({
					name: item._id,
					geometry: new Point(
						fromLonLat([item.coord.coordinates[0], item.coord.coordinates[1]]) // Marker position
					),
					attributes: {
						"pinType": "evacuation center",
						"name": `${item.name}`,
					},
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
		}

		console.log(vectorSource);

		// Add the vector source to a layer and add it to the map
		var markerLayer = new VectorLayer({
			source: vectorSource,
		});
		mountedMap.addLayer(markerLayer);	

		//mountedMap.on('pointermove', function (evt) {
		//  if (evt.dragging) {
		//    info.style.visibility = 'hidden';
		//    currentFeature = undefined;
		//    return;
		//  }
		//  const pixel = mountedMap.getEventPixel(evt.originalEvent);
		//  displayFeatureInfo(pixel, evt.originalEvent.target);
		//});

		async function onMapClick({dragging, map, coordinate}: MapBrowserEvent<any>) {
			console.log("started onMapClick function");
			//console.log(transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326'));
			console.log(coordinate);
			
			
			if(!dragging) {
				const pixel = map.getPixelFromCoordinate(coordinate);
				const [feat, ..._ ] = map.getFeaturesAtPixel(pixel);
				
				// feat = 0th elem of array of features
				if (typeof feat !== 'undefined') {
					console.log("is defined");
					console.log(feat);
					const obtained_id = feat.get('name');
					if(typeof obtained_id !== 'undefined') await goto(`/earthquake/${obtained_id}`);
					return;
				}
			}
		}

		mountedMap.on('click', onMapClick);

		let previousToast: string;

		async function onMapHover({dragging, map, coordinate}: MapBrowserEvent<any>) {
			console.log("started onMapHover function");

			if(!dragging) {
				const pixel = map.getPixelFromCoordinate(coordinate);
				const [feat, ..._ ] = map.getFeaturesAtPixel(pixel);
				toastStore.close(previousToast);

				// feat = 0th elem of array of features
				if (typeof feat !== 'undefined') {
					console.log("is defined");
					console.log(feat);
					
					const gotten_feature = feat.get('attributes');
					
					const pinType = gotten_feature.pinType;
					if(typeof pinType !== 'undefined') {
						if(pinType == "earthquake") {
							previousToast = toastStore.trigger({
								message: `${pinType} ${gotten_feature.time}`,
								background: 'variant-filled-primary',
								autohide: true,
							});
						} else if (pinType == "seismic station") {
							previousToast = toastStore.trigger({
								message: `${pinType} ${gotten_feature.code} ${gotten_feature.name}`,
								background: 'variant-filled-secondary',
								autohide: true,
							});
						} else if (pinType == "evacuation center") { // evacuation center
							previousToast = toastStore.trigger({
								message: `${pinType} ${gotten_feature.name}`,
								background: 'variant-filled-tertiary',
								autohide: true,
							})
						} else if (pinType == "geoJSON") {
							previousToast = toastStore.trigger({
								message: `${pinType} ${feat.get('adm1_en')}`,
								background: 'variant-filled-success',
								autohide: true,
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

<div bind:this={mapElement} class="map"></div>

<style>
	.map {
		height: 1080px; /* Specify a height for the map */
		width: 100%; /* Full width */
	}
</style>
