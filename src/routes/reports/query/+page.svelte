<script lang="ts">
	import { RangeSlider } from '@skeletonlabs/skeleton';
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';

	import LoginUserPromptError from '$lib/components/ui/LoginUserPromptError.svelte';
	
	export let form;
	let entryForm: HTMLFormElement;

	let selection = form?.selection ?? 0;
</script>

<h1 class="h1">Report Entry Submission</h1>
<hr />
{#if form?.missingCoord}
	Missing Coordinate: {form}
{/if}
<form
	method="POST"
	enctype="application/x-www-form-urlencoded"
	class="flex-col flex card space-y-4 p4"
	bind:this={entryForm}
>
	<article class="card flex-row m-4 p-1 space-y-3">
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim">Maximum Depth</div>
			<input type="number" name="maxDepth" title="maxDepth" step="any" value={form?.maxDepth ?? ''} />
			<div class="input-group-shim">km</div>
		</div>

		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim">Minimum Depth</div>
			<input type="number" name="minDepth" title="minDepth" step="any" value={form?.minDepth ?? ''} />
			<div class="input-group-shim">km</div>
		</div>

		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim">Maximum Magnitude</div>
			<input type="number" min={0} name="maxIntensity" title="maxIntensity" step="any" value={form?.maxIntensity ?? ''} />
			<div class="input-group-shim">Mw</div>
		</div>

		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim">Minimum Magnitude</div>
			<input type="number" min={0} name="minIntensity" title="minIntensity" step="any" value={form?.minIntensity ?? ''} />
			<div class="input-group-shim">Mw</div>
		</div>

		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim">Search for Dates Before</div>
			<input
				name="maxTime"
				title="Input Datetime for Earthquake Event"
				type="datetime-local"
				value={form?.maxTime ?? ''}
			/>
		</div>

		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim">Search for Dates After</div>
			<input
				name="minTime"
				title="Input Datetime for Earthquake Event"
				type="datetime-local"
				value={form?.minTime ?? ''}
			/>
		</div>
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim">Limit</div>
			<input type="number" name="limit" title="limit" placeholder="Limit the affected locations here shown in the record to the X nearest locations." step="any" value={form?.limit ?? ''} />
			<div class="input-group-shim">locations</div>
		</div>

		
		<div class="space-y-2">
			<label class="flex items-center space-x-2">
				<input class="radio" bind:group={selection} type="radio" checked name="selection" value={0}/>
				<p>No geographical search</p>
			</label>
			<label class="flex items-center space-x-2">
				<input class="radio" bind:group={selection} type="radio" name="selection" value={1}/>
				<p>Bounding Box - Give the 4 corner coordinates of affected areas</p>
			</label>
			<label class="flex items-center space-x-2">
				<input class="radio" bind:group={selection} type="radio" name="selection" value={2} />
				<p>Radial Bounding - Give the center and radius to encapsulate the affected areas</p>
			</label>
		</div>

					

		{#if (selection === 1)}
			<h2 class="h2">Bounding Box</h2>
			<div class="input-group input-group-divider grid-cols-[0.6fr_1fr_1fr]">
				<div class="input-group-shim">Top Left Coordinate</div>
				<input type="number" name="tl_long" title="Longitude" placeholder="Longitude in °" step="any" 
					value={form?.tl_long ?? ''} />
				<input type="number" name="tl_lat" title="Latitude" placeholder="Latitude in °" step="any" 
					value={form?.tl_lat ?? ''} />
			</div>

			<div class="input-group input-group-divider grid-cols-[0.6fr_1fr_1fr]">
				<div class="input-group-shim">Top Right Coordinate</div>
				<input type="number" name="tr_long" title="Longitude" placeholder="Longitude in °" step="any" 
					value={form?.tr_long ?? ''} />
				<input type="number" name="tr_lat" title="Latitude" placeholder="Latitude in °" step="any" 
					value={form?.tr_lat ?? ''} />
			</div>

			<div class="input-group input-group-divider grid-cols-[0.6fr_1fr_1fr]">
				<div class="input-group-shim">Bottom Left Coordinate</div>
				<input type="number" name="bl_long" title="Longitude" placeholder="Longitude in °" step="any" 
					value={form?.bl_long ?? ''} />
				<input type="number" name="bl_lat" title="Latitude" placeholder="Latitude in °" step="any" 
					value={form?.bl_lat ?? ''} />
			</div>

			<div class="input-group input-group-divider grid-cols-[0.6fr_1fr_1fr]">
				<div class="input-group-shim">Bottom Right Coordinate</div>
				<input type="number" name="br_long" title="Longitude" placeholder="Longitude in °" step="any" 
					value={form?.br_long ?? ''} />
				<input type="number" name="br_lat" title="Latitude" placeholder="Latitude in °" step="any" 
					value={form?.br_lat ?? ''} />
			</div>
		{:else if (selection === 2)}
			<h2 class="h2">Radial Bounding</h2>
			<div class="input-group input-group-divider grid-cols-[auto_1fr_1fr]">
				<div class="input-group-shim">Center Coordinates</div>
				<input type="number" name="c_long" title="Longitude" placeholder="Longitude in °" step="any" 
					value={form?.c_long ?? ''} />
				<input type="number" name="c_lat" title="Latitude" placeholder="Latitude in °" step="any" 
					value={form?.c_lat ?? ''} />
			</div>

			<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
				<div class="input-group-shim">Radius</div>
				<input type="number" name="radius" title="Radius" placeholder="Enter the radius of affected locations here." step="any" value={form?.radius ?? ''} />
				<div class="input-group-shim">km</div>
			</div>
		{/if} 
	</article>
	<button type="button" class="btn btn-sm variant-filled" on:click={() => entryForm.requestSubmit()}
		>Search</button
	>
</form>
