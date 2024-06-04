<!-- 
This SvelteKit component embeds a YouTube video player using the YouTube IFrame Player API.
It initializes the player with a given video ID and sets the player to autoplay.

Props:
- id (string): The ID of the YouTube video to be played.

The component structure:
- onMount: A lifecycle function to initialize the YouTube player when the component is mounted.
- svelte:head: Loads the YouTube IFrame API script.
- div: A container for the YouTube player with an ID that matches the YT.Player target.

Styling and behavior:
- The player is set to 100% width and height of the container.
- The player will automatically load and play the video specified by the video ID.
-->

<script>
	import { onMount } from 'svelte';

	// Variable to hold the YouTube player instance
	let player;
	// Prop to hold the YouTube video ID
	export let id;
	
	// ID for the YouTube player container
	const ytPlayerId = 'youtube-player';

	// onMount lifecycle function to initialize the YouTube player
	onMount(() => {
		function load() {
			// Create a new YouTube player with specified settings
			player = new YT.Player(ytPlayerId, {
				height: '100%',
				width: '100%',
				videoId: id,
				playerVars: { autoplay: 1 }
			});
		}

		// Check if the YouTube API is already loaded, otherwise set a callback
		if (window.YT) {
			load();
		} else {
			window.onYouTubeIframeAPIReady = load;
		}
	});
</script>

<svelte:head>
	<!-- Load the YouTube IFrame API script -->
	<script src="https://www.youtube.com/iframe_api"></script>
</svelte:head>

<!-- Container for the YouTube player -->
<div id={ytPlayerId} />
