<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->

<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->

<script>
	import SismikaOnboarding from "$lib/components/SismikaOnboarding.svelte";
	import SplashPage from "$lib/components/SplashPage.svelte";

	let innerWidth = 0;
	let innerHeight = 0;

	$: condition = innerWidth * 1.33 <= innerHeight;
</script>

<svelte:head>
	<title>Sismika</title>
	<meta name="description" content="Sismika interactive earthquake visualizer" />
</svelte:head>

<svelte:window bind:innerWidth bind:innerHeight />

<SismikaOnboarding/>
<SplashPage {innerWidth} {innerHeight} />