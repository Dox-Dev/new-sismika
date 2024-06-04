<!-- 
This SvelteKit component displays a data table for seismic stations with features such as sorting, filtering, pagination, and row count.
It uses the DataHandler from '@vincjo/datatables' to manage the data and handle these features.
The component also includes navigation to detail pages when a row is clicked.

Functionality:
- Sorts data by columns using ThSort components.
- Filters data by columns using ThFilter components.
- Allows searching through data using the Search component.
- Adjusts the number of rows per page with the RowsPerPage component.
- Displays the current row count with the RowCount component.
- Provides pagination controls with the Pagination component.
- Navigates to a detailed view of the clicked row using the SvelteKit goto function.

Props:
- data: The dataset to be displayed in the table.

The component structure:
- Script: Imports necessary components and initializes the DataHandler with the provided data.
- Div: Contains the table and its associated controls, including the header, table body, and footer.

Styling and behavior:
- The table and its elements use Tailwind CSS classes for styling.
- The components from Skeleton UI are used for the table and control elements.

Dependencies:
- Skeleton UI: Provides the base styles and components.
- Tailwind CSS: Provides utility classes for responsive design and styling.
- SvelteKit: Provides navigation functionality.
-->

<script>
	// Import local datatable components
	import ThSort from '$lib/components/client/ThSort.svelte';
	import ThFilter from '$lib/components/client/ThFilter.svelte';
	import Search from '$lib/components/client/Search.svelte';
	import RowsPerPage from '$lib/components/client/RowsPerPage.svelte';
	import RowCount from '$lib/components/client/RowCount.svelte';
	import Pagination from '$lib/components/client/Pagination.svelte';

	// Import handler from SSD
	import { DataHandler } from '@vincjo/datatables';
	import { goto } from '$app/navigation';
	import { StatusCodes } from 'http-status-codes';

	// Load local data
	export let data;

	// Initialize data handler - CLIENT
	const handler = new DataHandler(data.stationData, { rowsPerPage: 5 });
	const rows = handler.getRows();
</script>

<div class="overflow-x-auto space-y-4">
	<!-- Header -->
	<header class="flex justify-between gap-4">
		<!-- Search component for filtering data -->
		<Search {handler} />
		<!-- RowsPerPage component for selecting number of rows per page -->
		<RowsPerPage {handler} />
	</header>
	<!-- Table -->
	<table class="table table-hover table-compact w-full table-auto">
		<thead>
			<tr>
				<!-- ThSort components for sorting data by columns -->
				<ThSort {handler} orderBy="_id">Station ID</ThSort>
				<ThSort {handler} orderBy="code">Code</ThSort>
				<ThSort {handler} orderBy="name">Name</ThSort>
				<ThSort {handler} orderBy="type">Type</ThSort>
				<ThSort {handler} orderBy={(row) => row.coord.coordinates[0]}>Longitude</ThSort>
				<ThSort {handler} orderBy={(row) => row.coord.coordinates[1]}>Latitude</ThSort>
			</tr>
			<tr>
				<!-- ThFilter components for filtering data by columns -->
				<ThFilter {handler} filterBy="_id" />
				<ThFilter {handler} filterBy="code" />
				<ThFilter {handler} filterBy="name" />
				<ThFilter {handler} filterBy="type" />
				<ThFilter {handler} filterBy={(row) => row.coord.coordinates[0]} />
				<ThFilter {handler} filterBy={(row) => row.coord.coordinates[1]} />
			</tr>
		</thead>
		<tbody>
			<!-- Rows of the table, each row navigates to a detail view on click -->
			{#each $rows as row}
				<tr on:click={() => goto(`/seismic/${row._id}`)}>
					<td>{row._id}</td>
					<td>{row.code}</td>
					<td>{row.name}</td>
					<td>{row.type}</td>
					<td>{row.coord.coordinates[0]}</td>
					<td>{row.coord.coordinates[1]}</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<!-- Footer -->
	<footer class="flex justify-between">
		<!-- RowCount component for displaying current row count -->
		<RowCount {handler} />
		<!-- Pagination component for navigating between pages -->
		<Pagination {handler} />
	</footer>
</div>
