<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Events } from './types';

	const dispatch = createEventDispatcher();
</script>

<div
	class="card card-hover"
	on:keydown
	role="button"
	on:click={() => dispatch(Events.CardClick)}
	tabindex="0"
>
	<slot />
</div>
