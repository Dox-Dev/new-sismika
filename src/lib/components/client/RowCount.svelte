<!-- 
This SvelteKit component displays the row count information for a data table.
It uses the DataHandler from '@vincjo/datatables' to retrieve and display the current row count, including the start, end, and total number of rows.
If no entries are found, it displays a message indicating that no entries are available.

Props:
- handler (DataHandler): An instance of DataHandler to manage the data and current row count state.

The component structure:
- Script: Imports the DataHandler type and defines a reactive variable for the row count.
- Aside: An aside section that displays the row count information or a message if no entries are found.

Styling and behavior:
- The aside section uses Tailwind CSS classes for styling.
- The row count information is conditionally rendered based on the total row count.
-->

<script lang="ts">
	import type { DataHandler } from '@vincjo/datatables';

	// Prop passed to the component
	export let handler: DataHandler;

	// Reactive variable for the row count
	const rowCount = handler.getRowCount();
</script>

<!-- Aside section for displaying row count information -->
<aside class="text-sm leading-8 mr-6">
	<!-- Conditionally render row count or no entries message -->
	{#if $rowCount.total > 0}
		<b>{$rowCount.start}</b>
		- <b>{$rowCount.end}</b>
		/ <b>{$rowCount.total}</b>
	{:else}
		No entries found
	{/if}
</aside>
