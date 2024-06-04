<!-- 
This SvelteKit component provides a filter input field within a table header for filtering data in a data table.
It uses the DataHandler from '@vincjo/datatables' to perform the filtering operation based on the input value and a specified filter criterion.

Props:
- handler (DataHandler): An instance of DataHandler to manage the data and perform the filtering operation.
- filterBy (string): The criterion by which the data should be filtered (e.g., a column name).

The component structure:
- Script: Imports the DataHandler type, defines reactive variables for the input value and filter criterion.
- Table Header: A table header cell containing the filter input field.

Styling and behavior:
- The input field uses Tailwind CSS classes for styling.
- The input field triggers the filtering method on input, using the specified filter criterion.

Dependencies:
- Skeleton UI: Provides the base styles and components.
- Tailwind CSS: Provides utility classes for responsive design and styling.
-->

<script lang="ts">
	import type { DataHandler } from '@vincjo/datatables';

	// Props passed to the component
	export let handler: DataHandler;
	export let filterBy: string;

	// Reactive variable for the input value
	let value: string;
</script>

<!-- Table header cell containing the filter input field -->
<th>
	<!-- Filter input field -->
	<input
		class="input text-sm w-full"
		type="text"
		placeholder="Filter"
		bind:value
		on:input={() => {
			if (filterBy) handler.filter(value, filterBy);
		}}
	/>
</th>
<!-- Trigger filter on input if filterBy is specified -->