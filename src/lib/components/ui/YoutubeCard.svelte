<script>
    import { onMount } from 'svelte';

    let player;
    export let id;
    console.log(`ID ${id}`)
    const ytPlayerId = 'youtube-player';

    onMount(() => {
        function load() {
            player = new YT.Player(ytPlayerId, {
                height: '100%',
                width: '100%',
                videoId: id,
                playerVars: { autoplay: 1 }
            });
        }

        if (window.YT) {
            load();
        } else {
            window.onYouTubeIframeAPIReady = load;
        }
    });
</script>

<svelte:head>
    <script src="https://www.youtube.com/iframe_api"></script>
</svelte:head>

<div id={ytPlayerId} />