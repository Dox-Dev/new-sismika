<!--
This SvelteKit component displays information about a specific location.
It includes the location's name, long name, geographic level, population, and PSGC code.

Props:
- psgc (string): The Philippine Standard Geographic Code of the location.
- name (string): The short name of the location.
- longname (string): The full name of the location.
- geographicLevel (string): The geographic level of the location (e.g., city, municipality).
- population (number): The population of the location.

The component structure:
- BaseContentCard: A wrapper component that listens for a card click event to navigate to the location details page.
- Article section: Contains the population, geographic level, name, and long name of the location.
-->

<script lang="ts">
	import { goto } from '$app/navigation';
	import BaseContentCard from '../BaseContentCard.svelte';

	// Props passed to the component
	export let psgc: string;
	export let name: string;
	export let longname: string;
	export let geographicLevel: string;
	export let population: number;
</script>

<BaseContentCard on:cardClick={() => goto(`/locations/${psgc}`)}>
	<!-- Container for the location information -->
	<article class="my-1 flex flex-col flex-nowrap items-stretch">
		<!-- Section displaying the population -->
		<section class="text-xl flex flex-col px-10">
			<span>Population: {population.toLocaleString()}</span>
		</section>
		<hr />
		<!-- Section containing the geographic level, name, and long name -->
		<section class="flex flex-col flex-1 px-10">
			<!-- Geographic level and name -->
			<div>
				{geographicLevel}. {name}
			</div>
			<!-- Long name of the location -->
			<div class="italic">
				{longname}
			</div>
		</section>
	</article>
</BaseContentCard>
