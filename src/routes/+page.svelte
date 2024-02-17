<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->

<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->

<svelte:head>
	<title>Sismika</title>
	<meta name="description" content="Sismika interactive earthquake visualizer" />
</svelte:head>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5">
		<h1 class="h1">Let's get cracking bones!</h1>
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

<section>
	<h1>Dashboard</h1>
	<div class="mini-windows">
		<div class="graph-container">
			<!-- <MiniChart /> -->
			<a href="/chart"><button>View full graph</button></a>
		</div>
		<div class="logs-and-button">
			<div class="logs-container">
				<!-- <MiniLogs /> -->
			</div>
			<a href="/eventlogs"><button>View logs</button></a>
		</div>
	</div>
</section>
