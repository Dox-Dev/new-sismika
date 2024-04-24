<script lang="ts">
	import VerticalContainer from '$lib/components/ui/containers/VerticalContainer.svelte';
	import { goto } from '$app/navigation';
	import { Paginator, type PaginationSettings } from '@skeletonlabs/skeleton';
	import LocationCard from '$lib/components/ui/LocationCard.svelte';

	export let data;

	const { location, totalCount, page, limit } = data;

	let paginationSettings = {
		page,
		limit,
		size: totalCount,
		amounts: [8, 10, 15, 20]
	} satisfies PaginationSettings;

	$: paginatedSource = location;
</script>

<Paginator
	bind:settings={paginationSettings}
	showFirstLastButtons={false}
	showPreviousNextButtons
	showNumerals
	maxNumerals={1}
	on:page={(e) => goto(`?page=${e.detail}&limit=${paginationSettings.limit}`)}
	on:amount={(e) => goto(`?page=${paginationSettings.page}&limit=${e.detail}`)}
/>

<VerticalContainer>
	{#each paginatedSource as location}
		<LocationCard {...location} />
	{/each}
</VerticalContainer>
