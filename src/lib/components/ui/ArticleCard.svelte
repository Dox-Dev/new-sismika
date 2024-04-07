<script lang="ts">
    import YoutubeCard from './YoutubeCard.svelte';
    import { Carta, CartaViewer } from 'carta-md'

    function extractYouTubeId(url: string): string {
        const pattern = /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:embed\/|watch\?v=|v\/))([a-zA-Z0-9_-]{11})/;
        const match = url.match(pattern);
        return match ? match[1] : "";
    }

    export let time: string;
    export let type: number;
    export let content: string;
    export let url: string;
    export let submitter_id: string;

    let header: string;

    const date = new Date(time).toLocaleString()

    switch (type) {
        case 0:
            header = "Image";
            break;
        case 1:
            header = "Video";
            break;
        case 2:
            header = "Article";
            break;
        case 3:
            header = "Comment";
    }
    
    const carta = new Carta();
</script>

<article class="card">
    <header class="card-header">{header}</header>
	<section class="p-4">
        {#if (type === 0 )}
            <img src={url} alt=""/>
        {:else if (type === 1)}
            <YoutubeCard id={extractYouTubeId(url)}/>
        {:else}
            <CartaViewer {carta} value={content}/>
        {/if}
    </section>
	<footer class="card-footer">
        <div class='flex flex-col'>
        <p>{date}</p>
        <p>Submitter: {submitter_id}</p>
        </div> 
    </footer>
</article>