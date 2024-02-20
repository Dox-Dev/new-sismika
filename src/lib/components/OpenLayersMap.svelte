<script lang="ts">
    import { onMount } from 'svelte';
    import 'ol/ol.css';
    import Map from 'ol/Map';
    import View from 'ol/View';
    import TileLayer from 'ol/layer/Tile';
    import OSM from 'ol/source/OSM';
  
    // This is used to convert from [longitude, latitude]
    // to a coordinate system OpenLayers can read.
    // https://stackoverflow.com/questions/27820784/openlayers-3-center-map
    import { fromLonLat } from 'ol/proj';

    // This is used to check the current theme mode of the webpage.
    import { modeCurrent } from '@skeletonlabs/skeleton';

    // Initialize the tilesets, map, and mount.
    // Note that the tile_server will have change dynamically
    // depending on the current theme/mode.
    const tile_server = new OSM(); // tilemap
    let mapElement: HTMLElement;
    onMount(() => {
      new Map({
        target: mapElement,
        layers: [
          new TileLayer({
            // tile_server is where the links to the themes will be placed
            // https://github.com/CartoDB/basemap-styles
            source: tile_server,
          }),
        ],
        view: new View({
          center: fromLonLat([121.0685, 14.6539]), // Center of the map [longitude, latitude]
          zoom: 5, // Initial zoom level
        }),
      });
    });

    // Dynamically change the themeURL and tile_server link.
    let themeURL: string;
    $: themeURL = ($modeCurrent)?
    'https://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png':
    'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

    $: tile_server.setUrl(themeURL);
  </script>
  
  <style>
    .map {
      height: 400px; /* Specify a height for the map */
      width: 100%; /* Full width */
    }
  </style>
  
  <div bind:this={mapElement} class="map"></div>
  