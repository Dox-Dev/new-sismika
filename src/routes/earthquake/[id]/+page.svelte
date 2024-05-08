<script lang="ts">
	import {
		Accordion,
		AccordionItem,
		Paginator,
		type PaginationSettings
	} from '@skeletonlabs/skeleton';
	import VerticalContainer from '$lib/components/ui/containers/VerticalContainer.svelte';
	import LocationCard from '$lib/components/ui/LocationCard.svelte';
	import HorizontalContainter from '$lib/components/ui/containers/HorizontalContainter.svelte';
	import ArticleCard from '$lib/components/ui/ArticleCard.svelte';
	import EarthquakeTop from '$lib/components/ui/EarthquakeTop.svelte';
	import { goto } from '$app/navigation';
	import OpenLayersMapEarthquake from './OpenLayersMap-Earthquake.svelte';

	export let data: import('./$types').PageServerData;
	$: ({ _id, time, coord, depth, mi, mb, ms, li } = data.selectedEarthquake);
	$: totalAffected = data.affectedPopulation;

	let paginationSettingsArticle = {
		page: 0,
		limit: 5,
		size: data.locationSize,
		amounts: [3, 5, 8, 10]
	} satisfies PaginationSettings;

	let paginationSettingsLocation = {
		page: 0,
		limit: 3,
		size: data.locationSize,
		amounts: [3, 5, 8, 10]
	};

	$: paginatedArticles = data.articles;
	$: paginatedLocations = data.affectedLocations.slice(
		paginationSettingsLocation.page * paginationSettingsLocation.limit,
		paginationSettingsLocation.page * paginationSettingsLocation.limit +
			paginationSettingsLocation.limit
	);
</script>

<!-- Responsive Container (recommended) -->
<h1 class="h1">{data.title}</h1>
<div class="py-10">
	<OpenLayersMapEarthquake {data} />
</div>
<EarthquakeTop totalAffected={totalAffected.toLocaleString()} info={data.selectedEarthquake} />
<button type="button" class="btn btn-sm variant-filled" on:click={() => goto(`./${_id}/submit`)}
	>Submit Article/Information</button
>
<Accordion>
	{#if typeof paginatedArticles === 'object' && paginatedArticles.length > 0}
		<AccordionItem open>
			<svelte:fragment slot="summary">Media and Articles</svelte:fragment>
			<svelte:fragment slot="content">
				<HorizontalContainter>
					{#each paginatedArticles as article}
						<ArticleCard {...article} />
					{/each}
				</HorizontalContainter>
			</svelte:fragment>
		</AccordionItem>
	{/if}
	{#if li}
		<AccordionItem>
			<svelte:fragment slot="summary">Local Intensities</svelte:fragment>
			<svelte:fragment slot="content">
				{li}
			</svelte:fragment>
		</AccordionItem>
	{/if}
	<AccordionItem>
		<svelte:fragment slot="summary">Affected Areas</svelte:fragment>
		<svelte:fragment slot="content">
			<VerticalContainer>
				{#each paginatedLocations as location}
					<LocationCard {...location} />
				{:else}
					<p>There are no affected locations!</p>
				{/each}
			</VerticalContainer>
			{#if paginatedLocations.length > 0}
				<Paginator
					bind:settings={paginationSettingsLocation}
					showFirstLastButtons={false}
					showPreviousNextButtons
					showNumerals
					maxNumerals={1}
				/>
			{/if}
		</svelte:fragment>
	</AccordionItem>
	<AccordionItem>
		<svelte:fragment slot="summary">Datatable</svelte:fragment>
		<svelte:fragment slot="content">
			<div class="table-container">
				<!-- Native Table Element -->
				<table class="table table-hover">
					<thead>
						<tr>
							<th>Earthquake ID</th>
							<th>Time</th>
							<th>Longitude</th>
							<th>Latitude</th>
							<th>Depth</th>
							<th>Moment Magnitude</th>
							<th>Body Wave Magnitude</th>
							<th>Surface Wave Magnitude</th>
							<th>Local Intensity</th>
						</tr>
					</thead>
					<tbody>
						<!-- {#each tableArr as row, i} -->
						<tr>
							<td>{_id}</td>
							<td>{time}</td>
							<td>{coord.coordinates[0]}</td>
							<td>{coord.coordinates[1]}</td>
							<td>{depth}</td>
							<td>{mi}</td>
							<td>{mb}</td>
							<td>{ms}</td>
							<td>{li}</td>
						</tr>
						<!-- {/each} -->
					</tbody>
				</table>
			</div>
		</svelte:fragment>
	</AccordionItem>
</Accordion>
<article class="flex">
	<section></section>
</article>
