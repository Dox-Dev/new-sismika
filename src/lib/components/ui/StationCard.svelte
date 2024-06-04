<!-- 
This SvelteKit component displays information about a seismic event location.
It includes the location's ID, code, name, type, and coordinates, and provides navigation to a detailed view.

Props:
- _id (string): The unique identifier of the seismic event.
- code (string): The code representing the seismic event.
- name (string): The name of the seismic event.
- type (string): The type of the seismic event.
- coord (Coordinates): The geographic coordinates of the seismic event.

The component structure:
- BaseContentCard: A wrapper component that listens for a card click event to navigate to the seismic event details page.
- Article section: Contains the code, type, name, and coordinates of the seismic event.

Styling:
- The layout is flex-based, ensuring responsive and structured presentation of the information.
-->

<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Coordinates } from '$lib/model/src/util';
	import BaseContentCard from '../BaseContentCard.svelte';

	// Props passed to the component
	export let _id: string;
	export let code: string;
	export let name: string;
	export let type: string;
	export let coord: Coordinates;
</script>

<BaseContentCard on:cardClick={() => goto(`/seismic/${_id}`)}>
	<!-- Container for the seismic event information -->
	<article class="flex flex-row flex-nowrap items-stretch">
		<!-- Section displaying the code and type of the seismic event -->
		<section class="flex flex-col flex-10 px-1">
			<p>{code}</p>
			<p>{type}</p>
		</section>
		<!-- Section displaying the name and coordinates of the seismic event -->
		<section>
			<p>{name}</p>
			<p class="italic">{coord.coordinates[0]}°, {coord.coordinates[1]}°</p>
		</section>
	</article>
</BaseContentCard>
