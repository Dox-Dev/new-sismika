<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->

<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->

<script>
	let innerWidth = 0
	let innerHeight = 0
	
	$: condition = innerWidth*1.33 <= innerHeight
</script>

<svelte:head>
	<title>Sismika</title>
	<meta name="description" content="Sismika interactive earthquake visualizer" />
</svelte:head>

<svelte:window bind:innerWidth bind:innerHeight />

<!--
<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5">
		<h1 class="h1">Welcome to Sismika!</h1>
		<p>Start by exploring:</p>
		<ul>
			<li><code class="code">/src/routes/+layout.svelte</code> - barebones layout</li>
			<li><code class="code">/src/app.postcss</code> - app wide css</li>
			<li>
				<code class="code">/src/routes/+page.svelte</code> - this page, you can replace the contents
			</li>
		</ul>
	</div>
</div>
-->
<div class="container h-full v-full mx-auto flex justify-center items-center">
	<div class="space-y-5">
		<div>
			<h1 class="h1 text-center">
				<span class="bg-gradient-to-br from-red-500 to-yellow-500 bg-clip-text text-transparent box-decoration-clone text-8xl">
				SISMIKA
				</span>
			</h1>
			<h2 class="text-2xl text-center mb-12">An Interactive Earthquake Visualizer</h2>
			
			{#if innerWidth*1.33 <= innerHeight}
				<p class="mx-6 mb-6">
				Introducing our groundbreaking 
				Seismic Visualizer 					
				<span class="text-primary-500">
					Sismika</span>,  
				a cutting-edge tool developed by 
				<span class="text-primary-500">
					Marc Macaraeg</span>
				and 
				<span class="text-primary-500">
					Ellis Caluag</span>
				that revolutionizes the way we 
				interpret seismic data.
				</p>

				<p class="mx-6 mb-6">
				Tailored for seismic stations and 
				events, our visualizer is a
				<span class="text-primary-500">
					comprehensive solution designed 
					to enhance your understanding of 
					seismic activities</span>,
				including 
				earthquakes and volcanic events.
				</p>

				<p class="mx-6 mb-6">
				Should you need any assistance, or
				desire to report bugs, please do feel
				free to contact or message us in our
				socials shown directly below. We'll 
				be happy to accommodate you.
				</p>
			{:else}
				<p class="mx-12">
					Introducing our groundbreaking 
					Seismic Visualizer 
					<span class="text-primary-500">
						Sismika</span>, 
					a cutting-edge tool developed by 
					<span class="text-primary-500">
						Marc Macaraeg</span>
					and 
					<span class="text-primary-500">
						Ellis Caluag
					</span> 
					that revolutionizes the way we 
					interpret seismic data.
					
					Tailored for seismic stations and 
					events, our visualizer is a
					<span class="text-primary-500">
						comprehensive solution designed 
						to enhance your understanding of 
						seismic activities</span>,
					including 
					earthquakes and volcanic events.
	
					Should you need any assistance, or
					desire to report bugs, please do feel
					free to contact or message us in our
					socials shown directly below. We'll 
					be happy to accommodate you.
				</p>
			{/if}
		</div>
	</div>
</div>
<!--
<section>
	<h1>Dashboard</h1>
	<div class="mini-windows">
		<div class="graph-container">
			-->
			<!-- <MiniChart /> -->
			<!--
			<a href="/chart"><button>View full graph</button></a>
		</div>
		<div class="logs-and-button">
			<div class="logs-container">
				-->
				<!-- <MiniLogs /> -->
				<!--
			</div>
			<a href="/eventlogs"><button>View logs</button></a>
		</div>
	</div>
</section>
-->
