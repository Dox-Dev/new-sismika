<script lang="ts">
	import { goto } from "$app/navigation";
	import StationCard from "$lib/components/ui/StationCard.svelte"
	import VerticalContainer from "$lib/components/ui/containers/VerticalContainer.svelte"
	import { Paginator, type PaginationSettings } from "@skeletonlabs/skeleton";
	export let data;

	const {stations, totalCount, page, limit} = data;

	let paginationSettings = {
		page,
		limit,
		size: totalCount,
		amounts: [8, 10, 15, 20],
	} satisfies PaginationSettings;

	$: paginatedSource = stations

</script>

	<Paginator
		bind:settings={paginationSettings}
		showFirstLastButtons={false}
		showPreviousNextButtons
		showNumerals
		maxNumerals={1}
		on:page={(e)=> goto(`?page=${e.detail}&limit=${paginationSettings.limit}`)}
		on:amount={(e)=> goto(`?page=${paginationSettings.page}&limit=${e.detail}`)}
	/>
	<div>
		Anything missing? Tell us!
		<a href="/seismic/submit">
			<button type="button" class="btn btn-sm variant-filled"> Submit </button>
		</a>
	</div>
	<VerticalContainer>
		{#each paginatedSource as station}
			<StationCard {...station}/>
		{/each}
	</VerticalContainer>
	
