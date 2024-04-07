<script lang="ts">
    export let innerHeight: number;
    export let innerWidth: number;
</script>

<div class="container h-full v-full mx-auto flex justify-center items-center">
	<div class="space-y-5">
		<div>
			<h1 class="h1 text-center">
				<span
					class="bg-gradient-to-br from-red-500 to-yellow-500 bg-clip-text text-transparent box-decoration-clone text-8xl"
				>
					SISMIKA
				</span>
			</h1>
			<h2 class="text-2xl text-center mb-12">An Interactive Earthquake Visualizer</h2>

			{#if innerWidth * 1.33 <= innerHeight}
				<p class="mx-6 mb-6">
					Introducing our groundbreaking Seismic Visualizer
					<span class="text-primary-500"> Sismika</span>, a cutting-edge tool developed by
					<span class="text-primary-500"> Marc Macaraeg</span>
					and
					<span class="text-primary-500"> Ellis Caluag</span>
					that revolutionizes the way we interpret seismic data.
				</p>

				<p class="mx-6 mb-6">
					Tailored for seismic stations and events, our visualizer is a
					<span class="text-primary-500">
						comprehensive solution designed to enhance your understanding of seismic activities</span
					>, including earthquakes and volcanic events.
				</p>

				<p class="mx-6 mb-6">
					Should you need any assistance, or desire to report bugs, please do feel free to contact
					or message us in our socials shown directly below. We'll be happy to accommodate you.
				</p>
			{:else}
				<p class="mx-12">
					Introducing our groundbreaking Seismic Visualizer
					<span class="text-primary-500"> Sismika</span>, a cutting-edge tool developed by
					<span class="text-primary-500"> Marc Macaraeg</span>
					and
					<span class="text-primary-500"> Ellis Caluag </span>
					that revolutionizes the way we interpret seismic data. Tailored for seismic stations and events,
					our visualizer is a
					<span class="text-primary-500">
						comprehensive solution designed to enhance your understanding of seismic activities</span
					>, including earthquakes and volcanic events. Should you need any assistance, or desire to
					report bugs, please do feel free to contact or message us in our socials shown directly
					below. We'll be happy to accommodate you.
				</p>
			{/if}
		</div>

		<center>
			<a href="https://github.com/Dox-Dev/new-sismika" target="_blank">
				<button type="button" class="btn-icon btn-icon-lg variant-filled">
					<i class="fa-brands fa-github fa-xl" />
				</button>
			</a>
		</center>
	</div>
</div>
