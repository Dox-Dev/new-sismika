<!--
This SvelteKit component displays detailed information about an earthquake event.
It includes the earthquake's title, magnitude, coordinates, depth, time, and total affected people.

Props:
- info (EarthquakeEvent): An object containing details of the earthquake event.
- totalAffected (string): The total number of people affected by the earthquake.

The component structure:
- MagnitudeCard: A component displaying the magnitude of the earthquake.
- Article section: Contains the title, coordinates, magnitude, depth, formatted date/time, and total affected count.

Reactive statements are used to destructure the earthquake info and format the date/time.
-->

<script lang="ts">
	import type { EarthquakeEvent } from '$lib/model/src/event';
	import MagnitudeCard from './MagnitudeCard.svelte';

	// Props passed to the component
	export let info: EarthquakeEvent;
	export let totalAffected: string;

	// Reactive statement to destructure the earthquake event info
	$: ({ mw, coord, time, depth } = info);

	// Reactive statement to format the date/time
	$: dateTime = new Date(time).toLocaleString();
</script>

<article class="card flex flex-row">
	<!-- Display the magnitude in a separate card -->
	<MagnitudeCard magnitude={mw} />
	<!-- Section containing detailed information about the earthquake -->
	<section class="flex flex-col ml-5">
		<!-- Earthquake title -->
		<h3 class="h3">{info.title}</h3>
		<!-- Coordinates of the earthquake -->
		<div>{coord.coordinates[0]}°E, {coord.coordinates[1]}°N</div>
		<!-- Magnitude of the earthquake -->
		<div>Magnitude: {mw} mw</div>
		<!-- Depth of the earthquake -->
		<div>Depth: {depth} km</div>
		<!-- Formatted date/time of the earthquake -->
		<div>{dateTime}</div>
		<!-- Total number of people affected by the earthquake -->
		<div>Total Affected: {totalAffected}</div>
	</section>
</article>
