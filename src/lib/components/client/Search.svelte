<!-- 
This SvelteKit component provides a search input field for filtering data in a data table.
It uses the DataHandler from '@vincjo/datatables' to perform the search operation based on the input value.

Props:
- handler (DataHandler): An instance of DataHandler to manage the data and perform the search operation.

The component structure:
- Script: Imports the DataHandler type and defines a reactive variable for the input value.
- Input: An input field of type search that binds to the reactive value and triggers the search method on input.

Styling and behavior:
- The input field uses Tailwind CSS classes for styling.
- The input field adjusts its width based on screen size using responsive utility classes from Tailwind CSS.
-->

<script lang="ts">
	import type { DataHandler } from '@vincjo/datatables';

	// Prop passed to the component
	export let handler: DataHandler;

	// Reactive variable for the input value
	let value: string;
</script>

<!-- Search input field -->
<input
	class="input sm:w-64 w-36"
	type="search"
	placeholder="Search..."
	bind:value
	on:input={() => handler.search(value)}
/>
<!-- Trigger search on input -->
