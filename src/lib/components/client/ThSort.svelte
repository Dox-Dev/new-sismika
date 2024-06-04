<!-- 
This SvelteKit component provides a sortable table header for a data table.
It uses the DataHandler from '@vincjo/datatables' to manage the sorting state and perform the sorting operation based on a specified column.

Props:
- handler (DataHandler): An instance of DataHandler to manage the data and perform the sorting operation.
- orderBy (string): The column identifier by which the data should be sorted.

The component structure:
- Script: Imports the DataHandler type, defines a reactive variable for the current sort state.
- Table Header: A table header cell that triggers sorting on click and displays the sort direction.

Styling and behavior:
- The table header cell uses Tailwind CSS classes for styling.
- The sort direction indicator changes based on the current sort state.

Dependencies:
- Skeleton UI: Provides the base styles and components.
- Tailwind CSS: Provides utility classes for responsive design and styling.
-->

<script lang="ts">
	import type { DataHandler } from '@vincjo/datatables';

	// Props passed to the component
	export let handler: DataHandler;
	export let orderBy: string;

	// Reactive variable for the current sort state
	const sorted = handler.getSort();
</script>

<!-- Table header cell that triggers sorting on click -->
<th on:click={() => handler.sort(orderBy)} class="cursor-pointer select-none">
	<div class="flex h-full items-center justify-start gap-x-2">
		<!-- Slot for custom content inside the table header cell -->
		<slot />
		<!-- Display sort direction indicator based on current sort state -->
		{#if $sorted.identifier === orderBy}
			{#if $sorted.direction === 'asc'}
				&darr; <!-- Down arrow for ascending sort -->
			{:else if $sorted.direction === 'desc'}
				&uarr; <!-- Up arrow for descending sort -->
			{/if}
		{:else}
			&updownarrow; <!-- Up-down arrow when not sorted -->
		{/if}
	</div>
</th>
