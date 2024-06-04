<!-- 
This SvelteKit component provides an interactive card that can dispatch a custom event when clicked.
It uses Skeleton UI and Tailwind CSS for styling and behavior.

Functionality:
- Dispatches a custom "CardClick" event when the card is clicked.
- Supports keyboard interaction by listening for keydown events and making the div focusable with tabindex.

The component structure:
- Script: Imports necessary functions and types, sets up the event dispatcher.
- Div: A div element styled as a card, which dispatches the custom event on click and supports keyboard interaction.

Styling and behavior:
- The card uses Tailwind CSS classes for styling.
- The card is made focusable and accessible by using role="button" and tabindex="0".

Dependencies:
- Skeleton UI: Provides the base styles and components.
- Tailwind CSS: Provides utility classes for responsive design and styling.
-->

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Events } from './types';

	// Create an event dispatcher for custom events
	const dispatch = createEventDispatcher();
</script>

<!-- Div styled as an interactive card -->
<div
	class="card card-hover"
	on:keydown
	role="button"
	on:click={() => dispatch(Events.CardClick)}
	tabindex="0"
>
	<!-- Slot for custom content inside the card -->
	<slot />
</div>
