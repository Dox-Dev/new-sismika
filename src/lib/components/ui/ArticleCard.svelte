<!--
This SvelteKit component renders different types of content based on the given props.
It supports displaying images, YouTube videos, and articles/comments formatted using Carta.

Props:
- time (string): The timestamp of when the content was created or submitted.
- type (number): The type of content to display. 
  - 0: Image
  - 1: Video
  - 2: Article
  - 3: Comment
- content (string): The actual content to display if the type is Article or Comment.
- url (string): The URL of the content, used for images and YouTube videos.
- submitter_id (string): The ID of the user who submitted the content.

The component uses the `extractYouTubeId` function to parse YouTube video IDs from URLs.
It leverages `Carta` and `CartaViewer` for rendering Markdown content.

The component structure:
- Header: Displays the type of content (Image, Video, Article, Comment).
- Main Section: Renders the content based on the type.
  - Image: Renders an <img> element with the provided URL.
  - Video: Renders a YouTube video using the `YoutubeCard` component.
  - Article/Comment: Renders the content using `CartaViewer`.
- Footer: Displays the formatted date and the submitter's ID.
-->
<script lang="ts">
	import YoutubeCard from './YoutubeCard.svelte';
	import { Carta, CartaViewer } from 'carta-md';

	/**
	 * Extracts the YouTube video ID from a given URL.
	 * @param url - The URL of the YouTube video.
	 * @returns The extracted YouTube video ID or an empty string if not found.
	 */
	function extractYouTubeId(url: string): string {
		const pattern =
			/(?:https?:\/\/(?:www\.)?youtube\.com\/(?:embed\/|watch\?v=|v\/))([a-zA-Z0-9_-]{11})/;
		const match = url.match(pattern);
		return match ? match[1] : '';
	}

	// Props passed to the component
	export let time: string;
	export let type: number;
	export let content: string;
	export let url: string;
	export let submitter_id: string;

	// Variable to hold the header text based on the type
	let header: string;

	// Format the time string into a more readable date format
	const date = new Date(time).toLocaleString();

	// Set the header text based on the type of content
	switch (type) {
		case 0:
			header = 'Image';
			break;
		case 1:
			header = 'Video';
			break;
		case 2:
			header = 'Article';
			break;
		case 3:
			header = 'Comment';
			break;
		default:
			header = 'Unknown'; // Default case if type is not recognized
	}

	// Initialize Carta instance for rendering Markdown content
	const carta = new Carta();
</script>

<article class="card max-w-fit min-w-full max-h-96">
	<header class="card-header">{header}</header>
	<section class="p-4">
		{#if type === 0}
			<!-- Render an image if the type is 0 -->
			<img src={url} alt="" />
		{:else if type === 1}
			<!-- Render a YouTube video if the type is 1 -->
			<YoutubeCard id={extractYouTubeId(url)} />
		{:else}
			<!-- Render content using CartaViewer for other types (e.g., article or comment) -->
			<CartaViewer {carta} value={content} />
		{/if}
	</section>
	<footer class="card-footer">
		<div class="flex flex-col">
			<!-- Display the formatted date -->
			<p>{date}</p>
			<!-- Display the submitter ID -->
			<p>Submitter: {submitter_id}</p>
		</div>
	</footer>
</article>
