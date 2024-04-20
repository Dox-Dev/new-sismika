<script lang="ts">
	import LoginUserPromptError from '$lib/components/ui/LoginUserPromptError.svelte';

	export let form;
	let entryForm: HTMLFormElement;
</script>

<h1 class="h1">Evacuation Center Entry Submission</h1>
<hr />
{#if form?.authFail || form?.noPerms}
	<LoginUserPromptError />
{/if}
<form
	method="POST"
	enctype="application/x-www-form-urlencoded"
	class="flex-col flex card space-y-4 p4"
	bind:this={entryForm}
>
	<article class="card flex-row m-4 p-1 space-y-3">
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim">Name</div>
			<input type="text" name="name" title="Name" value={form?.name ?? ''} />
		</div>
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim">Longitude</div>
				<input
					class:input-error={!form?.long && form?.missing}
					type="number"
					name="long"
					title="Longitude"
					step="any"
					value={form?.long ?? ''}
				/>
			<div class="input-group-shim">°</div>
		</div>
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim">Latitude</div>
			<input type="number" name="lat" title="Latitude" step="any" value={form?.lat ?? ''} />
			<div class="input-group-shim">°</div>
		</div>
	</article>
	<button type="button" class="btn btn-sm variant-filled" on:click={() => entryForm.requestSubmit()}
		>Submit</button
	>
</form>

