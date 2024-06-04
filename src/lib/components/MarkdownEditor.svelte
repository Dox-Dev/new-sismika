<!-- 
This SvelteKit component provides a markdown editor using the Carta library.
It integrates DOMPurify for sanitizing the input to ensure security.

Functionality:
- Provides a markdown editor with live preview and editing capabilities.
- Uses DOMPurify to sanitize the input to prevent XSS attacks.

Props:
- value (string): The initial value of the markdown editor.

The component structure:
- Script: Imports necessary libraries, initializes Carta with DOMPurify, and defines the initial value.
- CartaEditor: Renders the markdown editor with two-way binding to the value.

Styling and behavior:
- The component imports default and light theme CSS files from Carta for styling.

Dependencies:
- Carta: Provides the markdown editor functionality.
- DOMPurify: Provides input sanitization.
- Tailwind CSS: Provides utility classes for responsive design and styling.
-->

<script lang="ts">
	import { Carta, CartaEditor } from 'carta-md'; // Import Carta and CartaEditor from carta-md
	import DOMPurify from 'isomorphic-dompurify'; // Import DOMPurify for sanitization
	import 'carta-md/default.css'; // Import default theme CSS for Carta
	import 'carta-md/light.css'; // Import light theme CSS for Carta

	// Initialize Carta with DOMPurify as the sanitizer
	const carta = new Carta({
		sanitizer: DOMPurify.sanitize
	});

	// Prop for the initial value of the markdown editor
	export let value = '';
</script>

<!-- Render the CartaEditor component with two-way binding to the value -->
<CartaEditor {carta} bind:value />
