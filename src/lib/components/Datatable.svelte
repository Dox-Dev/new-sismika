<!-- 
This SvelteKit component displays a data table for earthquake events with features such as sorting, filtering, pagination, and row count.
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
	import ThSort from '$lib/components/client/ThSort.svelte'; // Component for sortable table headers
	import ThFilter from '$lib/components/client/ThFilter.svelte'; // Component for filterable table headers
	import Search from '$lib/components/client/Search.svelte'; // Component for searching within the table
	import RowsPerPage from '$lib/components/client/RowsPerPage.svelte'; // Component for selecting number of rows per page
	import RowCount from '$lib/components/client/RowCount.svelte'; // Component for displaying row count
	import Pagination from '$lib/components/client/Pagination.svelte'; // Component for pagination controls

	// Import handler from SSD
	import { DataHandler } from '@vincjo/datatables'; // DataHandler for managing data operations
	import { goto } from '$app/navigation'; // SvelteKit navigation function
	import { StatusCodes } from 'http-status-codes'; // HTTP status codes

	// Load local data
	export let data; // Data passed to the component

	// Initialize data handler - CLIENT
	const handler = new DataHandler(data.equake, { rowsPerPage: 5 }); // DataHandler with initial rowsPerPage setting
	const rows = handler.getRows(); // Reactive variable for the rows in the current page
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
				<ThSort {handler} orderBy="_id">Event ID</ThSort>
				<ThSort {handler} orderBy="time">Time</ThSort>
				<ThSort {handler} orderBy={(row) => row.coord.long}>Longitude</ThSort>
				<ThSort {handler} orderBy={(row) => row.coord.lat}>Latitude</ThSort>
				<ThSort {handler} orderBy="depth">Depth</ThSort>
				<ThSort {handler} orderBy="mw">Moment Magnitude</ThSort>
				<ThSort {handler} orderBy="mb">Body Wave Magnitude</ThSort>
				<ThSort {handler} orderBy="ms">Surface Wave Magnitude</ThSort>
				<ThSort {handler} orderBy="li">Local Intensity</ThSort>
			</tr>
			<tr>
				<!-- ThFilter components for filtering data by columns -->
				<ThFilter {handler} filterBy="_id" />
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
			<!-- Rows of the table, each row navigates to a detail view on click -->
			{#each $rows as row}
				<tr
					on:click={() => {
						goto(`/earthquake/${row._id}`); // Navigate to the detailed view of the clicked row
					}}
				>
					<td>{row._id}</td>
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
		<!-- RowCount component for displaying current row count -->
		<RowCount {handler} />
		<!-- Pagination component for navigating between pages -->
		<Pagination {handler} />
	</footer>
</div>
