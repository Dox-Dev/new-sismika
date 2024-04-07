<script lang="ts">
	import { Carta, CartaEditor } from 'carta-md';
	import DOMPurify from 'isomorphic-dompurify';
	import 'carta-md/default.css';
	import 'carta-md/light.css';

	const carta = new Carta({
		sanitizer: DOMPurify.sanitize
	});

	export let value = '';
</script>

<CartaEditor {carta} bind:value />
