<script lang="ts">
	import { goto } from '$app/navigation';
	import BaseContentCard from '../BaseContentCard.svelte';

	export let psgc: string;
	export let name: string;
	export let longname: string;
	export let geographicLevel: string;
	export let population: number;
</script>

<BaseContentCard on:cardClick={() => goto(`/locations/${psgc}`)}>
	<article class="my-1 flex flex-col flex-nowrap items-stretch">
		<section class="text-xl flex flex-col px-10">
			<span>Population: {population}</span>
		</section>
		<hr />
		<section class="flex flex-col flex-1 px-10">
			<div>
				{geographicLevel}. {name}
			</div>
			<div class="italic">
				{longname}
			</div>
		</section>
	</article>
</BaseContentCard>
