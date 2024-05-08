<script lang="ts">
	import EarthquakeCard from '$lib/components/ui/EarthquakeCard.svelte';
	import { Accordion, AccordionItem, type PaginationSettings, Paginator } from '@skeletonlabs/skeleton';
	import LocationCard from '$lib/components/ui/LocationCard.svelte';
	import VerticalContainer from '$lib/components/ui/containers/VerticalContainer.svelte';

	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import StaticBottomContainer from '$lib/components/ui/containers/StaticBottomContainer.svelte';
	import { goto } from '$app/navigation';

	export let data: PageData;

	const { page: pageL, limit, equake, totalCount} = data;
	
	let paginationSettings = {
		page: pageL,
		limit,
		size: totalCount,
		amounts: [8, 10, 15, 20]
	} satisfies PaginationSettings;

	$: paginatedSource = equake;
</script>

<div class="card flex-row">
	<article>
		<LocationCard {...data.location} />
	</article>
	<div class="mb-16">
		<Accordion>
			<AccordionItem on:click={() => {
				if (data.equake.length > 0) goto(`${$page.url.pathname}/map`)}}>
				<svelte:fragment slot="summary"><i class="fa-regular fa-map"></i>Map</svelte:fragment>
				<svelte:fragment slot="content">
					<p>No recorded earthquake in database.</p>	
				</svelte:fragment>
			</AccordionItem>
			<AccordionItem open>
				<svelte:fragment slot="summary"
					><i class="fa-solid fa-house-crack"></i>Earthquakes</svelte:fragment
				>
				<svelte:fragment slot="content">
				{#if paginatedSource.length > 0}
					<div class="sticky top-0">
						<Paginator
							bind:settings={paginationSettings}
							showFirstLastButtons={false}
							showPreviousNextButtons
							showNumerals
							maxNumerals={1}
							on:page={(e) => goto(`?page=${e.detail}&limit=${paginationSettings.limit}`)}
							on:amount={(e) => goto(`?page=${paginationSettings.page}&limit=${e.detail}`)}
						/>
					</div>
				{/if}
					<VerticalContainer>
						{#each paginatedSource as { title, mw, _id, time }}
							<EarthquakeCard {title} magnitude={mw} equakeId={_id} dateTime={time} />
						{:else}
							<p>No recorded earthquake in database.</p>
						{/each}
					</VerticalContainer>
				</svelte:fragment>
			</AccordionItem>
		</Accordion>
	</div>	
	<StaticBottomContainer>
		{data.location.geographicLevel}. {data.location.longname}
	</StaticBottomContainer>
</div>
