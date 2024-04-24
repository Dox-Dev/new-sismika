<script>
	//Import local datatable components
	import ThSort from '$lib/components/client/ThSort.svelte';
	import ThFilter from '$lib/components/client/ThFilter.svelte';
	import Search from '$lib/components/client/Search.svelte';
	import RowsPerPage from '$lib/components/client/RowsPerPage.svelte';
	import RowCount from '$lib/components/client/RowCount.svelte';
	import Pagination from '$lib/components/client/Pagination.svelte';

	//Import handler from SSD
	import { DataHandler } from '@vincjo/datatables';
	import { goto } from '$app/navigation';

	//Load local data
	export let data;

	//Init data handler - CLIENT
	const handler = new DataHandler(data.equakes, { rowsPerPage: 5 });
	const rows = handler.getRows();
</script>

<div class=" overflow-x-auto space-y-4">
	<!-- Header -->
	<header class="flex justify-between gap-4">
		<Search {handler} />
		<RowsPerPage {handler} />
	</header>
	<!-- Table -->
	<table class="table table-hover table-compact w-full table-auto">
		<thead>
			<tr>
				<ThSort {handler} orderBy="title">Title</ThSort>
				<ThSort {handler} orderBy="time">Time</ThSort>
				<ThSort {handler} orderBy={(row) => row.coord.coordinates[0]}>Longitude</ThSort>
				<ThSort {handler} orderBy={(row) => row.coord.coordinates[1]}>Latitude</ThSort>
				<ThSort {handler} orderBy="depth">Depth</ThSort>
				<ThSort {handler} orderBy="mw">Moment Magnitude</ThSort>
				<ThSort {handler} orderBy="mb">Body Wave Magnitude</ThSort>
				<ThSort {handler} orderBy="ms">Surface Wave Magnitude</ThSort>
				<ThSort {handler} orderBy="li">Local Intensity</ThSort>
			</tr>
			<tr>
				<ThFilter {handler} filterBy="title" />
				<ThFilter {handler} filterBy="time" />
				<ThFilter {handler} filterBy={(row) => row.coord.coordinates[0]} />
				<ThFilter {handler} filterBy={(row) => row.coord.coordinates[1]} />
				<ThFilter {handler} filterBy="depth" />
				<ThFilter {handler} filterBy="mw" />
				<ThFilter {handler} filterBy="mb" />
				<ThFilter {handler} filterBy="ms" />
				<ThFilter {handler} filterBy="li" />
			</tr>
		</thead>
		<tbody>
			{#each $rows as row}
				<tr
					on:click={() => {
						goto(`/earthquake/${row._id}`);
					}}
				>
					<td>{row.title}</td>
					<td>{row.time}</td>
					<td>{row.coord.coordinates[0]}</td>
					<td>{row.coord.coordinates[1]}</td>
					<td>{row.depth}</td>
					<td>{row.mw}</td>
					<td>{row.mb}</td>
					<td>{row.ms}</td>
					<td>{row.li}</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<!-- Footer -->
	<footer class="flex justify-between">
		<RowCount {handler} />
		<Pagination {handler} />
	</footer>
</div>
