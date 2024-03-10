<script>
</script>
<!--
export const EarthquakeEventSchema = z.object({
	_id: ObjectIDSchema,
	time: z.string().datetime(),
	coord: CoordinatesSchema,
	depth: z.number(),
	mi: z.number(), //moment magnitude, mi
	mb: z.number(), //body-wave magnitude
	ms: z.number(), //surface wave magnitude.
	mw: z.number(),
	li: z.string() //string list of local intensities
});
-->
<h1 class="h1">Earthquake Entry Submission</h1>
<!-- <h1>Evacuation Center Submission</h1> -->
<br/>
<!-- To connect with certain values, use bind:value={variableName} in the input header-->
<label class="label">
	<span class="h3">ID</span>
	<input class="input" type="text" placeholder="Input the earthquake ID here" />
</label>
<br/>
<label class="label">
	<span class="h3">Time</span>
    <input class="input" type="text" placeholder="Input the time the earthquake happened here" />
</label>
<br/>

<span class="h3">Local Intensity</span>
<textarea class="textarea" rows="4" placeholder="Local Intensity" />
<br/>

<span class="h3">Coordinates</span>
<div class="input-group input-group-divider grid-cols-[1fr_1fr]">
    <input type="text" placeholder="Longitude" />
    <input type="text" placeholder="Latitude" />
</div>

<span class="h3">Magnitudes</span>
<div class="input-group input-group-divider grid-cols-[1fr_1fr_1fr]">
    <input type="text" placeholder="Moment Magnitude" />
    <input type="text" placeholder="Body-Wave Magnitude" />
	<input type="text" placeholder="Surface Wave Magnitude" />
</div>

<br>
<button type="button" class="btn btn-sm variant-filled">Submit</button>

