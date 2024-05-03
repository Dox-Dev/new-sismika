<script lang="ts">
	import { RangeSlider } from '@skeletonlabs/skeleton';
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';

	import LoginUserPromptError from '$lib/components/ui/LoginUserPromptError.svelte';
	
	export let form;
	let entryForm: HTMLFormElement;

	let isBoundingBox:boolean;
	$: isBoundingBox = true;
</script>

<h1 class="h1">Report Entry Submission</h1>
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
			<div class="input-group-shim">Maximum Depth</div>
			<input type="number" name="depth" title="maxDepth" step="any" value={form?.maxDepth ?? ''} />
			<div class="input-group-shim">km</div>
		</div>

		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim">Minimum Depth</div>
			<input type="number" name="depth" title="minDepth" step="any" value={form?.minDepth ?? ''} />
			<div class="input-group-shim">km</div>
		</div>

		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim">Maximum Magnitude</div>
			<input type="number" min={0} name="maxIntensity" title="maxIntensity" step="any" value={form?.maxIntensity ?? ''} />
			<!-- <div class="input-group-shim">km</div> -->
		</div>

		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim">Minimum Magnitude</div>
			<input type="number" min={0} name="minIntensity" title="minIntensity" step="any" value={form?.minIntensity ?? ''} />
			<!-- <div class="input-group-shim">km</div> -->
		</div>

		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim">Maximum Time</div>
			<input
				name="maxTime"
				title="Input Datetime for Earthquake Event"
				type="datetime-local"
				value={form?.maxTime ?? ''}
			/>
		</div>

		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim">Minimum Time</div>
			<input
				name="minTime"
				title="Input Datetime for Earthquake Event"
				type="datetime-local"
				value={form?.minTime ?? ''}
			/>
		</div>

		
		<div class="space-y-2">
			<label class="flex items-center space-x-2">
				<input class="radio" bind:group={isBoundingBox} type="radio" checked name="radio-direct-1" value={true}/>
				<p>Bounding Box - Give the 4 corner coordinates of affected areas</p>
			</label>
			<label class="flex items-center space-x-2">
				<input class="radio" bind:group={isBoundingBox} type="radio" name="radio-direct-2" value={false} />
				<p>Radial Bounding - Give the center and radius to encapsulate the affected areas</p>
			</label>
		</div>

					

		{#if isBoundingBox}
			<h2 class="h2">Bounding Box</h2>
			<div class="input-group input-group-divider grid-cols-[0.6fr_1fr_1fr]">
				<div class="input-group-shim">Top Left Coordinate</div>
				<input type="number" name="TL_long" title="Longitude" placeholder="Longitude in °" step="any" 
					value={form?.geographicBound.BoundingBoxSchema.coordinates[0][0] ?? ''} />
				<input type="number" name="TL_lat" title="Latitude" placeholder="Latitude in °" step="any" 
					value={form?.geographicBound.BoundingBoxSchema.coordinates[0][1] ?? ''} />
			</div>

			<div class="input-group input-group-divider grid-cols-[0.6fr_1fr_1fr]">
				<div class="input-group-shim">Top Right Coordinate</div>
				<input type="number" name="TR_long" title="Longitude" placeholder="Longitude in °" step="any" 
					value={form?.geographicBound.BoundingBoxSchema.coordinates[1][0] ?? ''} />
				<input type="number" name="TR_lat" title="Latitude" placeholder="Latitude in °" step="any" 
					value={form?.geographicBound.BoundingBoxSchema.coordinates[1][1] ?? ''} />
			</div>

			<div class="input-group input-group-divider grid-cols-[0.6fr_1fr_1fr]">
				<div class="input-group-shim">Bottom Left Coordinate</div>
				<input type="number" name="BL_long" title="Longitude" placeholder="Longitude in °" step="any" 
					value={form?.geographicBound.BoundingBoxSchema.coordinates[2][0] ?? ''} />
				<input type="number" name="BL_lat" title="Latitude" placeholder="Latitude in °" step="any" 
					value={form?.geographicBound.BoundingBoxSchema.coordinates[2][1] ?? ''} />
			</div>

			<div class="input-group input-group-divider grid-cols-[0.6fr_1fr_1fr]">
				<div class="input-group-shim">Bottom Right Coordinate</div>
				<input type="number" name="BR_long" title="Longitude" placeholder="Longitude in °" step="any" 
					value={form?.geographicBound.BoundingBoxSchema.coordinates[3][0] ?? ''} />
				<input type="number" name="BR_lat" title="Latitude" placeholder="Latitude in °" step="any" 
					value={form?.geographicBound.BoundingBoxSchema.coordinates[3][1] ?? ''} />
			</div>
		{:else}
			<h2 class="h2">Radial Bounding</h2>
			<div class="input-group input-group-divider grid-cols-[auto_1fr_1fr]">
				<div class="input-group-shim">Center Coordinates</div>
				<input type="number" name="BR_long" title="Longitude" placeholder="Longitude in °" step="any" 
					value={form?.coordinateCenter.CoordinateSchema.coordinates[0] ?? ''} />
				<input type="number" name="BR_lat" title="Latitude" placeholder="Latitude in °" step="any" 
					value={form?.coordinateCenter.CoordinateSchema.coordinates[1] ?? ''} />
			</div>

			<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
				<div class="input-group-shim">Radius</div>
				<input type="number" name="radius" title="Radius" placeholder="Enter the radius of affected locations here." step="any" value={form?.radius ?? ''} />
				<div class="input-group-shim">km</div>
			</div>

			<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
				<div class="input-group-shim">Limit</div>
				<input type="number" name="radius" title="Radius" placeholder="Limit the affected locations here shown in the record to the X nearest locations." step="any" value={form?.radius ?? ''} />
				<div class="input-group-shim">locations</div>
			</div>

		{/if} 
	</article>
	<button type="button" class="btn btn-sm variant-filled" on:click={() => entryForm.requestSubmit()}
		>Submit</button
	>
</form>
