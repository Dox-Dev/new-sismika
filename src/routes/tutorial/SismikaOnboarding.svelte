<script lang="ts">
	import { goto } from '$app/navigation';
	import { Stepper, Step } from '@skeletonlabs/skeleton';

	async function completeTutorial(e: Event) {
		return( await goto('/map') );
	}
</script>

<div>
	<Stepper on:complete={completeTutorial}>
		<Step>
			<svelte:fragment slot="header">Introduction</svelte:fragment>
			<p>
				Welcome to Sismika, the innovative seismic visualizer designed to empower you with
				comprehensive information about seismic events in the Philippines! Our mission is to enhance
				public awareness, preparedness, and resilience in a region that is no stranger to the forces
				of nature. 
				<br><br>
				Let's get started on your journey to navigating and utilizing Sismika effectively! 
			</p>
		</Step>
		<Step>
			<svelte:fragment slot="header">Feature Overview</svelte:fragment>
				As you have probably seen, the Navigation Bar on the top left lets you access all the possible main routes
				of the website.
				
				Note that these routes are to be read as <code class="code">new-sismika.vercel.app[ROUTE]</code> (example: <code class="code">/</code> can be accessed by typing <code class="code">new-sismika.vercel.app/</code> in the search bar of your browser).
				
				These consist of:
				<ol>
					<li><code class="code">/</code> where the Homepage is, containing an introduction on what Sismika is</li> 
					<li><code class="code">/tutorial</code> where the Tutorial is, which is where you are at right now</li>
					<li><code class="code">/map</code> where the Map is, containing all the map pins of each earthquake, seismic center, evacuation center, as well as outlines of the Philippines' regions and its tectonic plates</li>
					<li><code class="code">/earthquake</code> where the Earthquakes are, containing a table of all recorded earthquake events as well as giving the user access to details of these individual entries via clicking and an option to submit new entries</li>
					<li><code class="code">/seismic</code> where the Seismic Stations are, containing a table of all known seismic centers in the Philippines, as well as individual entries for each station via clicking and an option to submit new entries</li>
					<li><code class="code">/evaccenter</code> where the Evacuation Centers are, containing a table of known evacuation centers supported by PHIVOLCS as well as their individual entries via clicking and an option to submit new entries</li>
					<li><code class="code">/auth/login</code> where you, the user, logs in to be able to access the features of the Sismika website</li>
				</ol>
		</Step>

		<Step>
			<svelte:fragment slot="header">Logging in</svelte:fragment>
				First of all, you'd want to login via the Login button in the Navigation Bar (accessible by pressing the hamburger icon on the top left of the screen).
				This will redirect you to a Google Login link, which uses your Google account as your login to avoid any password logging.
				<br><br>
				You'll know you're logged in once you reaccess the Navigation Bar and see your Google name and picture on the bottom part of said Navigation Bar.
				After you logged in, you'll now have access to all the features of Sismika, including the Interactive Philippine Map where seismic events are visually presented.
		</Step>

		<Step>
			<svelte:fragment slot="header">The Map</svelte:fragment>
				The map is the heart of Sismika, where seismic events and other information relevant to a citizen of the Philippines would be interested in knowing.
				In the map, there are multiple map icons and pins that we must be made aware of:
				<ol>
					<li>
						<span>
							<img src="./images/seismic-1.png" class="inline-flex" width=16/>
							<img src="./images/seismic-2.png" class="inline-flex" width=16/>
							<img src="./images/seismic-3.png" class="inline-flex" width=16/>
							<img src="./images/seismic-4.png" class="inline-flex" width=16/>
							<img src="./images/seismic-5.png" class="inline-flex" width=16/>
							<img src="./images/seismic-6.png" class="inline-flex" width=16/>
							<img src="./images/seismic-7.png" class="inline-flex" width=16/>
							<img src="./images/seismic-8.png" class="inline-flex" width=16/>
							<img src="./images/seismic-9.png" class="inline-flex" width=16/>
							<img src="./images/seismic-10.png" class="inline-flex" width=16/>
							all represent Earthquake Events with varying magnitudes from 1 to 10
						</span>
					</li>
					<li><span><img src="./images/station.png" class="inline-flex" width=16/> represents Seismic Centers which record seismic events and data</span></li>
					<li><span><img src="./images/evacuation.png" class="inline-flex" width=16/> represents Evacuation Centers where people go to during a disaster</span></li>
				</ol>

				<br>
				The map also provides several features such as:
				<ul>
					<li><i class="fa fa-eye-slash"></i> Being able to toggle map pins on and off using the Show and Hide buttons at the top</li>
					<li><i class="fa fa-magnifying-glass"></i> Being able to hover over the map for information of each point and feature</li>
					<li><i class="fa fa-arrow-pointer"></i> Being able to click on pins to redirect you to their details page (i.e., <code class="code">earthquake/[id]</code>, <code class="code">seismic/[id]</code>, <code class="code">evaccenter/[id]</code> given the map pin's <code class="code">[id]</code>)</li>
					<li><i class="fa fa-earth-asia"></i> Displaying the regions and plate tectonics separately (accessible via <code class="code">/map/tectonic</code>)</li>
					<li><i class="fa fa-magnifying-glass-plus"></i> Zooming in and out of the map to look at features more closely</li>
				</ul>
		</Step>

		<Step>
			<svelte:fragment slot="header">The Earthquakes</svelte:fragment>
			The <code class="code">/earthquake</code> route brings you to a table of earthquake events, each displaying several key information which are:
			<ul>
				<li><i class="fa-solid fa-house-chimney-crack"></i> Magnitude level, which is how strong the earthquake event was</li>
				<li><i class="fa-solid fa-map-pin"></i> Location, which is where the earthquake came from and gives a decent idea of what places were affected</li>
				<li><i class="fa-solid fa-calendar-days"></i> Date and time, which is when the event happened</li>
			</ul>
			
			<br>
			There's also a Submit button below this table, which would redirect the user to a form where they could submit an earthquake event entry to be reviewed by professionals (this route is located in <code class="code">/earthquake/submit</code>).
			Additional information that would be requested alongside those mentioned above would include:
			<ul>
				<li><i class="fa-solid fa-arrow-down"></i> Depth or how deep the earthquake originated from under the surface </li>
				<li><i class="fa-solid fa-street-view"></i> Local intensities or descriptions of the degree of damage that the event caused to their local community and surroundings </li>
			</ul>

			<br>
			Clicking on one of these entries would bring you to the specific <code class="code">/earthquake/[id]</code> page of the earthquake entry, 
			where you can view additional information such as:
			<ul>
				<li><i class="fa-solid fa-users-slash"></i> Total number of affected people</li>
				<li><i class="fa-solid fa-users-between-lines"></i> Affected areas and their populations</li>
				<li><i class="fa-solid fa-map-location-dot"></i> Interactive map that shows affected areas</li>
				<li><i class="fa-solid fa-table"></i> Summarized datatable entry of the event</li>
				<li><i class="fa-solid fa-photo-film"></i> Several user-submitted media (i.e., articles, comments, videos, images) related to the event</li>
			</ul>

			<br>
			There is also a Submit button here dedicated to the user-submitted media portion of each event entry which is located in <code class="code">/earthquake/[id]/submit</code>.
		</Step>

		<Step>
			<svelte:fragment slot="header">The Seismic Stations</svelte:fragment>
			Similar to the Earthquakes page, the Seismic Stations page (located in <code class="code">/seismic</code>) houses a table with all the publicly known and functioning seismic stations that continue to collect seismic data.
			In this view, we can see all information related to each entry. 
			These include the following information:
			<ul>
				<li><i class="fa-solid fa-hashtag"></i> Station Code</li>
				<li><i class="fa-solid fa-font"></i> Station Name</li>
				<li><i class="fa-solid fa-tower-cell"></i> Station Type</li>
				<li><i class="fa-solid fa-location-dot"></i> Coordinates (Longitude and Latitude)</li>
			</ul>
			
			<br>
			Clicking on an entry, you're brought to its individual entry whose route is located in <code class="code">/seismic/[id]</code> with some given <code class="code">[id]</code>.
			The information contained within this individual entry page are shown in cards rather than the tabular form displayed within the overall table in <code class="code">/seismic</code>.
			This is for the purpose of better visualization and hopefully better retention due to a more visual layout.
		</Step>

		<Step>
			<svelte:fragment slot="header">The Evacuation Centers</svelte:fragment>
			Similar to both pages mentioned earlier (Earthquakes and Seismic Stations), the Evacuation Centers page (located in <code class="code">/evaccenter</code>) contains a table with all the recorded evacuation centers people can go to in cases of emergency and/or disaster.
			In this view, we can see all information related to each entry. 
			These include the following information:
			<ul>
				<li><i class="fa-solid fa-font"></i> Evacuation Center Name</li>
				<li><i class="fa-solid fa-location-dot"></i> Coordinates (Longitude and Latitude)</li>
			</ul>
			
			<br>
			Clicking on an entry, you're brought to its individual entry whose route is located in <code class="code">/evaccenter/[id]</code> with some given evacuation center that has the website assigned id value of <code class="code">[id]</code>.
			The information contained within this individual entry page are shown in cards rather than the tabular form displayed within the overall table in <code class="code">/seismic</code>.
			This is for the purpose of better visualization and hopefully better retention due to a more visual layout.
		</Step>
	</Stepper>
</div>

<style>
	div {
		margin: 1.25rem;
		border: 0.125rem solid black;
		padding: 0.625rem;
		border-radius: 1rem;
	}
</style>
