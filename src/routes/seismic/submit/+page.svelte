<script>
	// export const EvacCenterSchema = z.object({
	//     _id: ObjectIDSchema,
	//     name: z.string(),
	//     coord: CoordinatesSchema
	// });
</script>

<h1 class="h1">Seismic Station Submission</h1>
<!-- <h1>Evacuation Center Submission</h1> -->
<br />
<!-- To connect with certain values, use bind:value={variableName} in the input header-->
<form method="POST" enctype="application/x-www-form-urlencoded" class="card space-y-4 p-4">
	<label class="label">
		<span class="h3">ID</span>
		<input class="input" type="text" placeholder="Input the seismic station ID here" />
	</label>
	<br />
	<label class="label">
		<span class="h3">Code</span>
		<input class="input" type="text" placeholder="Input the evacuation center code here" />
	</label>
	<br />
	<label class="label">
		<span class="h3">Name</span>
		<input class="input" type="text" placeholder="Input the evacuation center code here" />
	</label>
	<br />
	<label class="label">
		<span class="h3">Type</span>
		<input class="input" type="text" placeholder="Input the evacuation center code here" />
	</label>
	<br />

	<span class="h3">Coordinates</span>
	<div class="input-group input-group-divider grid-cols-[1fr_1fr]">
		<input type="text" placeholder="Longitude" />
		<input type="text" placeholder="Latitude" />
	</div>

	<br />
	<a href="/seismic"><button type="button" class="btn btn-sm variant-filled">Submit</button></a>
</form>
