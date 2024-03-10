<script lang="ts">
	import '../app.postcss';

	// Highlight JS
	import hljs from 'highlight.js/lib/core';
	import 'highlight.js/styles/github-dark.css';
	import { storeHighlightJs } from '@skeletonlabs/skeleton';
	import xml from 'highlight.js/lib/languages/xml'; // for HTML
	import css from 'highlight.js/lib/languages/css';
	import javascript from 'highlight.js/lib/languages/javascript';
	import typescript from 'highlight.js/lib/languages/typescript';

	hljs.registerLanguage('xml', xml); // for HTML
	hljs.registerLanguage('css', css);
	hljs.registerLanguage('javascript', javascript);
	hljs.registerLanguage('typescript', typescript);
	storeHighlightJs.set(hljs);

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	// Layout of website
	// https://www.skeleton.dev/components/app-shell
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';

	//https://www.skeleton.dev/components/app-rail
	import { AppRail, AppRailTile, AppRailAnchor } from '@skeletonlabs/skeleton';
	let currentTile: number = 0;

	// Responsive app drawer
	// https://www.skeleton.dev/blog/how-to-implement-a-responsive-sidebar-drawer
	import Navigation from '$lib/components/Navigation.svelte';
	import { initializeStores, Drawer, getDrawerStore } from '@skeletonlabs/skeleton';
	initializeStores();

	const drawerSettings: DrawerSettings = {
		id: 'example-3',
		// Provide your property overrides:
		//bgDrawer: 'bg-purple-900 text-white',
		//bgBackdrop: 'bg-gradient-to-tr from-indigo-500/50 via-purple-500/50 to-pink-500/50',
		//width: 'w-[280px] md:w-[480px]',
		width: 'w-[280px]',
		//padding: 'p-4',
		rounded: 'rounded-xl',
	};

	const drawerStore = getDrawerStore();

	function drawerOpen(): void {
		drawerStore.open(drawerSettings);
	}

	// OpenLayersMap API
	import OpenLayersMap from '$lib/components/OpenLayersMap.svelte';
  
	// Light/Dark mode toggle button
	import { LightSwitch } from '@skeletonlabs/skeleton';
</script>

<Drawer>
	<!-- (contents) -->
	<Drawer>
		<h2 class="p-4">Navigation</h2>
		<hr />
		<Navigation />
	</Drawer>
</Drawer>
<!--- <AppShell slotSidebarLeft="bg-surface-500/5 w-56 p-4"> -->
<AppShell slotSidebarLeft="hidden bg-surface-500/5 w-0px">
	<svelte:fragment slot="header">
		<AppBar>
			<!--Header-->
			<svelte:fragment slot="lead">
    			<div class="flex items-center">
    			    <button class="btn btn-sm mr-4" on:click={drawerOpen}>
    			        <span>
    			            <svg viewBox="0 0 100 80" class="fill-token w-4 h-4">
    			                <rect width="100" height="20" />
    			                <rect y="30" width="100" height="20" />
    			                <rect y="60" width="100" height="20" />
    			            </svg>
    			        </span>
    			    </button>
					<strong class="text-xl uppercase">Sismika</strong>
    			</div>
			</svelte:fragment>

			<svelte:fragment slot="trail">
				<LightSwitch />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<!-- Sidebar Left -->
	<svelte:fragment slot="sidebarLeft">
		<!---<div id="sidebar-left" class="hidden lg:block">Sidebar Working</div>-->
		<Navigation />
	</svelte:fragment>

	<!-- <OpenLayersMap /> -->
	<!-- (sidebarRight) -->
	<!-- (pageHeader) -->
	<!-- Router Slot -->
	<slot />
	<!-- ---- / ---- -->
	<!--  <svelte:fragment slot="pageFooter">Page Footer</svelte:fragment> -->
	<!-- (footer) -->
</AppShell>
