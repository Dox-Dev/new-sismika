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
	import { StatusCodes } from 'http-status-codes';

	//Load local data
	export let data;

	//Init data handler - CLIENT
	const handler = new DataHandler(data.stationData, { rowsPerPage: 5 });
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
				<ThSort {handler} orderBy="_id">Station ID</ThSort>
				<ThSort {handler} orderBy="code">Code</ThSort>
				<ThSort {handler} orderBy="name">Name</ThSort>
				<ThSort {handler} orderBy="type">Type</ThSort>
				<ThSort {handler} orderBy={(row) => row.coord.coordinates[0]}>Longitude</ThSort>
				<ThSort {handler} orderBy={(row) => row.coord.coordinates[1]}>Latitude</ThSort>
			</tr>
			<tr>
				<ThFilter {handler} filterBy="_id" />
				<ThFilter {handler} filterBy="code" />
				<ThFilter {handler} filterBy="name" />
				<ThFilter {handler} filterBy="type" />
				<ThFilter {handler} filterBy={(row) => row.coord.coordinates[0]} />
				<ThFilter {handler} filterBy={(row) => row.coord.coordinates[1]} />
			</tr>
		</thead>
		<tbody>
			{#each $rows as row}
				<tr
					on:click={() => {
						goto(`/earthquake/${row._id}`);
					}}
				>
					<td>{row._id}</td>
					<td>{row.code}</td>
					<td>{row.name}</td>
					<td>{row.type}</td>
					<td>{row.coord.long}</td>
					<td>{row.coord.lat}</td>
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
