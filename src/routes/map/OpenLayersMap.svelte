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
	import type { Pixel } from 'ol/pixel';
	import type { MapBrowserEvent } from 'ol';
	import { goto } from '$app/navigation';
	import type { Coordinate } from 'ol/coordinate';
	import MagnitudeCard from '$lib/components/ui/MagnitudeCard.svelte';
	import { late } from 'zod';
	export let data: PageData;
	export let centerCoord = [122.0641419, 9.16875];
	export let zoom = 6;

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
				center: fromLonLat(centerCoord), // Center of the map [longitude, latitude]
				zoom // Initial zoom level
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
		//console.log('earthquake', data.equake);
		if (typeof data.equake !== 'boolean') {
			data.equake.forEach(function (item) {
				//console.log('earthquake', item._id, item.coord.coordinates[0], item.coord.coordinates[1]);
				// Create a feature for the marker
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
					src: `/seismic-${intensity}.png`
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

		// Add the vector source to a layer and add it to the map
		//const earthquakeLayer = new VectorLayer({
		//	source: vectorSource,
		//});
		earthquakeLayer.setSource(vectorSource);
		mountedMap.addLayer(earthquakeLayer);

		vectorSource = new VectorSource();

		//console.log('stations', data.station);
		if (typeof data.station !== 'boolean') {
			data.station.forEach(function (item) {
				////console.log("station", item.coord.coordinates[0], item.coord.coordinates[1]);
				// Create a feature for the marker
				var marker = new Feature({
					name: item._id,
					geometry: new Point(
						fromLonLat([item.coord.coordinates[0], item.coord.coordinates[1]]) // Marker position
					),
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

				// Create a style for the marker
				var iconStyle = new Style({
					image: icon
				});

				// Apply the style to the marker
				marker.setStyle(iconStyle);
				////console.log(marker);

				// Add the marker to the vector source
				vectorSource.addFeature(marker);
			});
		}

		// Add the vector source to a layer and add it to the map
		//const seismicLayer = new VectorLayer({
		//	source: vectorSource,
		//});
		seismicLayer.setSource(vectorSource);
		mountedMap.addLayer(seismicLayer);

		vectorSource = new VectorSource();

		// Iterate over the data to create and add each marker
		//console.log('evacuation centers', data.evac);
		if (typeof data.evac !== 'boolean') {
			data.evac.forEach(function (item) {
				//console.log('evacuation', item.coord.coordinates[0], item.coord.coordinates[1]);
				// Create a feature for the marker
				var marker = new Feature({
					name: item._id,
					geometry: new Point(
						fromLonLat([item.coord.coordinates[0], item.coord.coordinates[1]]) // Marker position
					),
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

		// Add the vector source to a layer and add it to the map
		//const evacLayer = new VectorLayer({
		//	source: vectorSource,
		//});
		evacLayer.setSource(vectorSource);
		mountedMap.addLayer(evacLayer);

		//console.log(vectorSource);

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
						else if (pinType == 'evacuation center') await goto(`/evaccenter/${obtained_id}`);
						else if (pinType == "geoJSON") await goto(`/locations/${feat.get("adm1_psgc")}`)
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
							// evacuation center
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

	// Dynamically change the themeURL and tile_server link.
	let themeURL: string;
	$: themeURL = $modeCurrent
		? 'https://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
		: 'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

	$: tile_server.setUrl(themeURL)
	
	$: latestEntry = data.equake[data.equake.length - 1]
</script>


<div class="overflow-hidden">
	<div bind:this={mapElement} class="relative top-0 left-0 h-screen w-screen"></div>
	<div class="absolute bottom-0 select-none">
		<div class="flex flex-col">
			<section class="flex flex-row items-center">
				<input type="checkbox" on:click={() => showOrHideIcons('earthquake')} checked={isHidden[0]}>
				<p class="underline decoration-dotted">
					{#if isHidden[0]}
					Show Earthquakes
					{:else}
					Hide Earthquakes
					{/if} 
				</p>
			</section>
			<section class="flex flex-row items-center">
				<input type="checkbox" on:click={() => showOrHideIcons('seismic center')} checked={isHidden[1]}>
				<p class="underline decoration-dotted">
					{#if isHidden[1]}
					Show Seismic Stations
					{:else}
					Hide Seismic Stations
					{/if} 
				</p>
			</section>
			<button type="button" class="btn btn-sm variant-filled max-w-48">
				<a href="/map/tectonic"> See Tectonic Plates </a>
			</button>
		</div>
	</div>
	<div class="absolute bottom-0 right-0 min-w-40" on:click={() => goto(`/earthquake/${latestEntry._id}`)}>
		Latest Earthquake
		<div>
		<MagnitudeCard magnitude={data.equake[data.equake.length -1].mw}/>
		</div> 
		{new Date(latestEntry.time).toDateString()}
	</div>
	
</div>
