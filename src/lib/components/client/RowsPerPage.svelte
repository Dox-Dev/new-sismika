<!-- 
This SvelteKit component provides a dropdown menu for selecting the number of rows to display per page in a data table.
It uses the DataHandler from '@vincjo/datatables' to manage the number of rows per page.
The user can choose from predefined options to set how many rows are displayed per page.

Props:
- handler (DataHandler): An instance of DataHandler to manage the data and rows per page state.

The component structure:
- Script: Imports the DataHandler type, defines a reactive variable for rows per page, and specifies the options for the dropdown menu.
- Aside: An aside section that contains a dropdown menu for selecting the number of rows per page.

Styling and behavior:
- The aside section uses Tailwind CSS classes for styling.
- The dropdown menu binds to the rowsPerPage value from the DataHandler.

Options:
- The dropdown menu provides options for 5, 10, 20, 50, and 100 rows per page.
-->

<script lang="ts">
	import type { DataHandler } from '@vincjo/datatables';

	// Prop passed to the component
	export let handler: DataHandler;

	// Reactive variable for the number of rows per page
	const rowsPerPage = handler.getRowsPerPage();
	
	// Options for the dropdown menu
	const options = [5, 10, 20, 50, 100];
</script>

<!-- Aside section for the rows per page dropdown menu -->
<aside class="flex place-items-center">
	Show
	<select class="select ml-2" bind:value={$rowsPerPage}>
		<!-- Dropdown options for selecting the number of rows per page -->
		{#each options as option}
			<option value={option}>
				{option}
			</option>
		{/each}
	</select>
</aside>
