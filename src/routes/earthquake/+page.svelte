<script lang="ts">
	import { goto } from "$app/navigation";
	import EarthquakeCard from "$lib/components/ui/EarthquakeCard.svelte";
	import VerticalContainer from "$lib/components/ui/containers/VerticalContainer.svelte";
	import { Paginator, type PaginationSettings } from "@skeletonlabs/skeleton";
	export let data;

	const {equakes, totalCount, page, limit} = data;

	let paginationSettings = {
		page,
		limit,
		size: totalCount,
		amounts: [8, 10, 15, 20],
	} satisfies PaginationSettings;

	$: paginatedSource = equakes
</script>

<main>
	<Paginator
		bind:settings={paginationSettings}
		showFirstLastButtons={false}
		showPreviousNextButtons
		showNumerals
		maxNumerals={1}
		on:page={(e)=> goto(`?page=${e.detail}&limit=${paginationSettings.limit}`)}
		on:amount={(e)=> goto(`?page=${paginationSettings.page}&limit=${e.detail}`)}
	/>

	<VerticalContainer>
		{#each paginatedSource as { title, mw, _id, time }}
			{#if typeof _id === "string"}
				<EarthquakeCard {title} magnitude={mw} equakeId={_id} dateTime={time} />
			{/if}
		{/each}
	</VerticalContainer>

	<div>
		Anything missing? Tell us!
		<a href="/earthquake/submit">
			<button type="button" class="btn btn-sm variant-filled"> Submit </button>
		</a>
	</div>
</main>