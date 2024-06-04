<!-- 
This SvelteKit component provides pagination controls for navigating through data pages.
It uses the DataHandler from '@vincjo/datatables' to manage the data and current page state.
The component renders different button layouts for desktop and mobile views using Skeleton UI and Tailwind CSS.

Props:
- handler (DataHandler): An instance of DataHandler to manage pagination state and actions.

The component structure:
- Script: Imports the DataHandler type and defines reactive variables for pagination.
- Desktop Buttons: A section of buttons for desktop view, with ellipsis for long page ranges.
- Mobile Buttons: A simplified section of buttons for mobile view, showing only previous and next controls.

Styling and behavior:
- The buttons use Tailwind CSS classes for styling and conditional classes for active and disabled states.
- The component conditionally renders ellipsis in the page list when necessary.
-->

<script lang="ts">
	import type { DataHandler } from '@vincjo/datatables';

	// Prop passed to the component
	export let handler: DataHandler;

	// Reactive variables for pagination state
	const pageNumber = handler.getPageNumber();
	const pageCount = handler.getPageCount();
	const pages = handler.getPages({ ellipsis: true });
</script>

<!-- Desktop buttons -->
<section class="btn-group variant-ghost-surface [&>*+*]:border-surface-500 h-10 hidden lg:block">
	<!-- Button to go to the previous page -->
	<button
		type="button"
		class="hover:variant-soft-primary"
		class:disabled={$pageNumber === 1}
		on:click={() => handler.setPage('previous')}
	>
		←
	</button>
	<!-- Buttons for individual pages with ellipsis for long ranges -->
	{#each $pages as page}
		<button
			type="button"
			class="hover:variant-soft-primary"
			class:active={$pageNumber === page}
			class:ellipse={page === null}
			on:click={() => handler.setPage(page)}
		>
			{page ?? '...'}
		</button>
	{/each}
	<!-- Button to go to the next page -->
	<button
		type="button"
		class="hover:variant-soft-primary"
		class:disabled={$pageNumber === $pageCount}
		on:click={() => handler.setPage('next')}
	>
		→
	</button>
</section>

<!-- Mobile buttons -->
<section class="lg:hidden">
	<!-- Button to go to the previous page -->
	<button
		type="button"
		class="btn variant-ghost-surface mr-2 mb-2 hover:variant-soft-primary"
		class:disabled={$pageNumber === 1}
		on:click={() => handler.setPage('previous')}
	>
		←
	</button>
	<!-- Button to go to the next page -->
	<button
		type="button"
		class="btn variant-ghost-surface mb-2 hover:variant-soft-primary"
		class:disabled={$pageNumber === $pageCount}
		on:click={() => handler.setPage('next')}
	>
		→
	</button>
</section>
