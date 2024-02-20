<script>
    import { onMount } from 'svelte';
    import 'ol/ol.css';
    import Map from 'ol/Map';
    import View from 'ol/View';
    import TileLayer from 'ol/layer/Tile';
    import OSM from 'ol/source/OSM';
    import XYZ from 'ol/source/XYZ';
  
    // Used to convert from [longitude, latitude] to 
    // a coordinate system OpenLayers can read
    // https://stackoverflow.com/questions/27820784/openlayers-3-center-map
    import { fromLonLat } from 'ol/proj';

    const sourceOSM = new XYZ();
    let mapElement;
    // Initialize the mount as well as the map
    onMount(() => {
      new Map({
        target: mapElement,
        layers: [
          new TileLayer({
            // https://github.com/CartoDB/basemap-styles
            //source: new OSM({
            //  url: 'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
            //}),
            source: sourceOSM,
          }),
        ],
        view: new View({
          center: fromLonLat([121.0685, 14.6539]), // Center of the map [longitude, latitude]
          zoom: 5, // Initial zoom level
        }),
      });
    });

    import { modeCurrent } from '@skeletonlabs/skeleton';;

    let themeURL;
    $: themeURL = ($modeCurrent)?
    'https://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png':
    'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

    $: sourceOSM.setUrl(themeURL);
  </script>
  
  <style>
    .map {
      height: 400px; /* Specify a height for the map */
      width: 100%; /* Full width */
    }
  </style>
  
  <div bind:this={mapElement} class="map"></div>
  