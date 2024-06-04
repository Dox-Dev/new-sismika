<!--
This SvelteKit component displays information about an earthquake.
It includes the earthquake's title, magnitude, unique ID, and date/time of occurrence.

Props:
- title (string): The title or description of the earthquake.
- magnitude (number): The magnitude of the earthquake.
- equakeId (string): The unique ID of the earthquake.
- dateTime (string): The date and time of the earthquake in ISO format.

The component structure:
- BaseContentCard: A wrapper component that listens for a card click event to navigate to the earthquake details page.
- MagnitudeCard: A component displaying the rounded magnitude of the earthquake.
- Article section: Contains the title, formatted date/time, and magnitude of the earthquake.

Reactive statements are used to format the date/time and round the magnitude.
-->

<script lang="ts">
	import BaseContentCard from '../BaseContentCard.svelte';
	import MagnitudeCard from './MagnitudeCard.svelte';
	import { goto } from '$app/navigation';

	// Props passed to the component
	export let title: string;
	export let magnitude: number;
	export let equakeId: string;
	export let dateTime: string;

	// Reactive statement to format the date/time
	$: dateTime = new Date(dateTime).toLocaleString();
	// Reactive statement to round the magnitude
	$: magnitudeRounded = Math.round(magnitude);
</script>

<BaseContentCard on:cardClick={() => goto(`/earthquake/${equakeId}`)}>
	<!-- Container for the earthquake information -->
	<article class="flex flex-row flex-nowrap items-stretch">
		<!-- Display the rounded magnitude in a separate card -->
		<MagnitudeCard magnitude={magnitudeRounded} />
		<!-- Section containing the title, date/time, and magnitude details -->
		<section class="flex flex-col flex-1 px-10">
			<!-- Earthquake title -->
			<div><p class="font-bold">{title}</p></div>
			<!-- Formatted date/time -->
			<div>{dateTime}</div>
			<!-- Magnitude detail -->
			<div>M {magnitude} mw</div>
		</section>
	</article>
</BaseContentCard>
