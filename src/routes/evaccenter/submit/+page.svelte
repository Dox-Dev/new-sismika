<script>
	// export const EvacCenterSchema = z.object({
	//     _id: ObjectIDSchema,
	//     name: z.string(),
	//     coord: CoordinatesSchema
	// });
</script>

<h1 class="h1">Evacuation Center Submission</h1>
<!-- <h1>Evacuation Center Submission</h1> -->
<br />
<!-- To connect with certain values, use bind:value={variableName} in the input header-->
<label class="label">
	<span class="h3">ID</span>
	<input class="input" type="text" placeholder="Input the evacuation center ID here" />
</label>
<br />
<label class="label">
	<span class="h3">Name</span>
	<input class="input" type="text" placeholder="Input the evacuation center name here" />
</label>
<br />

<span class="h3">Coordinates</span>
<div class="input-group input-group-divider grid-cols-[1fr_1fr]">
	<input type="text" placeholder="Longitude" />
	<input type="text" placeholder="Latitude" />
</div>

<br />
<button type="button" class="btn btn-sm variant-filled">Submit</button>
