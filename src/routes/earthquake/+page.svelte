<script lang="ts">
	import EarthquakeCard from '$lib/components/ui/EarthquakeCard.svelte';
	import VerticalContainer from '$lib/components/ui/containers/VerticalContainer.svelte';
	import { Paginator, type PaginationSettings } from '@skeletonlabs/skeleton';
	export let data;

	const { equakeData } = data;

	let paginationSettings = {
		page: 0,
		limit: 10,
		size: equakeData.length,
		amounts: [8, 10, 15, 20]
	} satisfies PaginationSettings;

	$: paginatedSource = equakeData.slice(
		paginationSettings.page * paginationSettings.limit,
		paginationSettings.page * paginationSettings.limit + paginationSettings.limit
	);
</script>

<main>
	<Paginator
		bind:settings={paginationSettings}
		showFirstLastButtons={false}
		showPreviousNextButtons
		showNumerals
		maxNumerals={1}
	/>

	<VerticalContainer>
		{#each paginatedSource as { mw, _id, time }}
			{#if typeof _id === "string"}
				<EarthquakeCard magnitude={mw} equakeId={_id} dateTime={time} />
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