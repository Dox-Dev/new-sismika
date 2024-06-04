<!-- 
This SvelteKit component displays a radial progress indicator using the ProgressRadial component from Skeleton UI.
It is a simple wrapper that imports and uses the ProgressRadial component.

Functionality:
- Displays a radial progress indicator.

The component structure:
- Script: Imports the ProgressRadial component from Skeleton UI.
- ProgressRadial: Renders the radial progress indicator.

Styling and behavior:
- The ProgressRadial component uses default styles and behavior as provided by Skeleton UI.
-->

<script lang="ts">
	// Import the ProgressRadial component from Skeleton UI
	import { ProgressRadial } from '@skeletonlabs/skeleton';
</script>

<!-- Render the ProgressRadial component -->
<ProgressRadial></ProgressRadial>
